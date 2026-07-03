"use server";

import { AssignmentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { validateAllAssignments, validateAssignmentRules } from "@/lib/validation/assignment-validation";

const optionalDateField = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? new Date(`${value}T00:00:00.000Z`) : null));

const dateField = z.string().min(1).transform((value) => new Date(`${value}T00:00:00.000Z`));

const assignmentSchema = z.object({
  customerId: z.string().min(1),
  productGroupId: z.string().min(1),
  sellerId: z.string().min(1),
  roleId: z.string().min(1),
  allocationPercent: z.coerce.number().min(0).max(200),
  startDate: dateField,
  endDate: optionalDateField,
  reasonNotes: z.string().trim().optional()
});

async function getActorUserId(role: "SALES_COMP_ADMIN" | "SALES_MANAGER" = "SALES_COMP_ADMIN") {
  const user = await prisma.demoUser.findFirst({
    where: {
      role,
      active: true
    },
    select: {
      id: true
    }
  });

  return user?.id ?? null;
}

async function nextAssignmentNumber() {
  const count = await prisma.assignment.count();
  return `A-${String(1001 + count).padStart(4, "0")}`;
}

async function writeAudit(
  objectId: string,
  action: string,
  newValue: unknown,
  comment: string,
  actorRole: "SALES_COMP_ADMIN" | "SALES_MANAGER" = "SALES_COMP_ADMIN"
) {
  await prisma.auditLog.create({
    data: {
      objectType: "Assignment",
      objectId,
      action,
      actorUserId: await getActorUserId(actorRole),
      newValueJson: JSON.stringify(newValue),
      comment
    }
  });
}

async function createAssignmentWithStatus(formData: FormData, status: AssignmentStatus) {
  await requirePermission(status === "SUBMITTED" ? "assignments:submit" : "assignments:create");
  const parsed = assignmentSchema.parse(Object.fromEntries(formData));

  if (parsed.endDate && parsed.endDate <= parsed.startDate) {
    throw new Error("End date must be after start date.");
  }

  const actorUserId = await getActorUserId();
  const assignment = await prisma.assignment.create({
    data: {
      assignmentNumber: await nextAssignmentNumber(),
      customerId: parsed.customerId,
      productGroupId: parsed.productGroupId,
      sellerId: parsed.sellerId,
      roleId: parsed.roleId,
      allocationPercent: new Prisma.Decimal(parsed.allocationPercent),
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      status,
      reasonNotes: parsed.reasonNotes,
      createdByUserId: actorUserId,
      updatedByUserId: actorUserId
    }
  });

  await validateAssignmentRules(assignment.id);
  await writeAudit(
    assignment.id,
    status === "SUBMITTED" ? "SUBMIT" : "CREATE",
    { assignmentNumber: assignment.assignmentNumber, status },
    status === "SUBMITTED" ? "Created and submitted assignment from workbench." : "Created draft assignment from workbench."
  );

  revalidatePath("/assignments");
  redirect(`/assignments/${assignment.id}?created=${status.toLowerCase()}`);
}

export async function saveDraftAssignment(formData: FormData) {
  await createAssignmentWithStatus(formData, "DRAFT");
}

export async function submitNewAssignment(formData: FormData) {
  await createAssignmentWithStatus(formData, "SUBMITTED");
}

export async function submitAssignment(formData: FormData) {
  await requirePermission("assignments:submit");
  const id = z.string().min(1).parse(formData.get("id"));

  const assignment = await prisma.assignment.update({
    where: { id },
    data: {
      status: "SUBMITTED",
      updatedByUserId: await getActorUserId()
    }
  });

  await validateAssignmentRules(assignment.id);
  await writeAudit(assignment.id, "SUBMIT", { status: "SUBMITTED" }, "Submitted assignment for review.");
  revalidatePath("/assignments");
  revalidatePath(`/assignments/${assignment.id}`);
}

export async function revalidateAssignment(formData: FormData) {
  await requirePermission("assignments:create");
  const id = z.string().min(1).parse(formData.get("id"));
  await validateAssignmentRules(id);
  await writeAudit(id, "VALIDATE", { validated: true }, "Revalidated assignment from detail screen.");
  revalidatePath("/assignments");
  revalidatePath(`/assignments/${id}`);
}

export async function revalidateAllAssignments() {
  await requirePermission("validator:view");
  const result = await validateAllAssignments();
  await prisma.auditLog.create({
    data: {
      objectType: "Validation",
      objectId: "all-assignments",
      action: "VALIDATE_ALL",
      actorUserId: await getActorUserId(),
      newValueJson: JSON.stringify(result),
      comment: "Revalidated all active/submitted/draft assignments from Split Validator."
    }
  });
  revalidatePath("/validator");
  revalidatePath("/assignments");
}

function approvalStatusForDates(startDate: Date, endDate: Date | null) {
  const now = new Date();

  if (startDate <= now && (!endDate || endDate >= now)) {
    return "ACTIVE" as const;
  }

  return "APPROVED" as const;
}

export async function approveAssignment(formData: FormData) {
  await requirePermission("assignments:approve");
  const id = z.string().min(1).parse(formData.get("id"));
  const comments = z.string().trim().optional().parse(formData.get("comments") ?? undefined);

  const validationResults = await validateAssignmentRules(id);
  const hasErrors = validationResults.some((result) => result.severity === "ERROR");

  if (hasErrors) {
    await writeAudit(
      id,
      "APPROVE_BLOCKED",
      { reason: "VALIDATION_ERRORS" },
      "Not ready for approval. Resolve validation errors before approving.",
      "SALES_MANAGER"
    );
    revalidatePath("/approvals");
    redirect(`/assignments/${id}?approval=blocked`);
  }

  const current = await prisma.assignment.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      startDate: true,
      endDate: true
    }
  });

  if (!current) {
    throw new Error("Assignment not found.");
  }

  const nextStatus = approvalStatusForDates(current.startDate, current.endDate);
  const approverUserId = await getActorUserId("SALES_MANAGER");

  const assignment = await prisma.assignment.update({
    where: { id },
    data: {
      status: nextStatus,
      updatedByUserId: approverUserId
    }
  });

  if (approverUserId) {
    await prisma.approvalHistory.create({
      data: {
        assignmentId: assignment.id,
        approverUserId,
        decision: "APPROVED",
        comments: comments || "Approved from approval queue."
      }
    });
  }

  await writeAudit(assignment.id, "APPROVE", { status: nextStatus }, "Approved assignment from approval queue.", "SALES_MANAGER");
  revalidatePath("/approvals");
  revalidatePath("/assignments");
  revalidatePath(`/assignments/${assignment.id}`);
}

export async function rejectAssignment(formData: FormData) {
  await requirePermission("assignments:approve");
  const id = z.string().min(1).parse(formData.get("id"));
  const comments = z.string().trim().min(3, "Rejection comment is required.").parse(formData.get("comments"));
  const approverUserId = await getActorUserId("SALES_MANAGER");

  const assignment = await prisma.assignment.update({
    where: { id },
    data: {
      status: "REJECTED",
      updatedByUserId: approverUserId
    }
  });

  if (approverUserId) {
    await prisma.approvalHistory.create({
      data: {
        assignmentId: assignment.id,
        approverUserId,
        decision: "REJECTED",
        comments
      }
    });
  }

  await writeAudit(assignment.id, "REJECT", { status: "REJECTED", comments }, "Rejected assignment from approval queue.", "SALES_MANAGER");
  revalidatePath("/approvals");
  revalidatePath("/assignments");
  revalidatePath(`/assignments/${assignment.id}`);
}
