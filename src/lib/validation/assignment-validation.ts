import { prisma } from "@/lib/db";
import { dateRangesOverlap, directSplitTotal, hasOverlappingApprovedSellerRole, lpsSplitTotal } from "@/lib/validation/rules";

type ValidationResultInput = {
  assignmentId: string;
  validationGroupKey: string;
  ruleCode: string;
  severity: "INFO" | "WARNING" | "ERROR";
  message: string;
};

export async function validateAssignmentRules(assignmentId: string) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      role: true,
      seller: true,
      customer: true,
      productGroup: true
    }
  });

  if (!assignment) {
    throw new Error("Assignment not found.");
  }

  if (assignment.status === "EXPIRED" || assignment.status === "REJECTED") {
    await prisma.validationResult.deleteMany({
      where: { assignmentId }
    });

    return [];
  }

  const relatedAssignments = await prisma.assignment.findMany({
    where: {
      customerId: assignment.customerId,
      productGroupId: assignment.productGroupId,
      status: {
        notIn: ["REJECTED", "EXPIRED"]
      }
    },
    include: {
      role: true,
      seller: true
    }
  });

  const group = relatedAssignments.filter((item) =>
    dateRangesOverlap(assignment.startDate, assignment.endDate, item.startDate, item.endDate)
  );

  const validationGroupKey = `${assignment.customer.customerCode}|${assignment.productGroup.productGroupCode}|${assignment.startDate.toISOString().slice(0, 10)}`;
  const results: ValidationResultInput[] = [];

  if (assignment.endDate && assignment.endDate <= assignment.startDate) {
    results.push({
      assignmentId,
      validationGroupKey,
      ruleCode: "DATE_ORDER",
      severity: "ERROR",
      message: "End date must be after start date."
    });
  }

  if (!assignment.seller.active) {
    results.push({
      assignmentId,
      validationGroupKey,
      ruleCode: "INACTIVE_SELLER",
      severity: "ERROR",
      message: "Seller is inactive for the selected date range."
    });
  }

  const directTotal = directSplitTotal(group);

  if (assignment.role.behavior === "SPLIT") {
    results.push({
      assignmentId,
      validationGroupKey,
      ruleCode: "DIRECT_SPLIT_TOTAL",
      severity: directTotal === 100 ? "INFO" : "ERROR",
      message:
        directTotal === 100
          ? "Direct seller split is 100%."
          : `Direct seller split is ${directTotal}%. Adjust to 100% before approval.`
    });
  }

  const lpsTotal = lpsSplitTotal(group);

  if (assignment.role.behavior === "SPLIT_WITH_LIMIT") {
    results.push({
      assignmentId,
      validationGroupKey,
      ruleCode: "LPS_SPLIT_MAX",
      severity: lpsTotal <= 100 ? "INFO" : "ERROR",
      message:
        lpsTotal <= 100
          ? `LPS allocation is ${lpsTotal}%.`
          : `LPS allocation is ${lpsTotal}%. Reduce to 100% or less.`
    });
  }

  if (assignment.role.behavior === "ADDITIVE") {
    results.push({
      assignmentId,
      validationGroupKey,
      ruleCode: "OVERLAY_ADDITIVE",
      severity: "INFO",
      message: "Overlay role is additive and will not reduce direct seller split."
    });
  }

  const overlappingSameSellerRole = hasOverlappingApprovedSellerRole(assignment, group);

  if (overlappingSameSellerRole) {
    results.push({
      assignmentId,
      validationGroupKey,
      ruleCode: "DATE_OVERLAP",
      severity: "ERROR",
      message: "This assignment overlaps an existing approved assignment."
    });
  }

  await prisma.validationResult.deleteMany({
    where: { assignmentId }
  });

  if (results.length > 0) {
    await prisma.validationResult.createMany({
      data: results
    });
  }

  return results;
}

export async function validateAllAssignments() {
  await prisma.validationResult.deleteMany({
    where: {
      assignment: {
        status: {
          in: ["REJECTED", "EXPIRED"]
        }
      }
    }
  });

  const assignments = await prisma.assignment.findMany({
    where: {
      status: {
        notIn: ["REJECTED", "EXPIRED"]
      }
    },
    select: {
      id: true
    }
  });

  let resultCount = 0;

  for (const assignment of assignments) {
    const results = await validateAssignmentRules(assignment.id);
    resultCount += results.length;
  }

  return {
    assignmentCount: assignments.length,
    resultCount
  };
}
