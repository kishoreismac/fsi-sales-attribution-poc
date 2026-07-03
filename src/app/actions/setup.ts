"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const dateField = z.string().min(1).transform((value) => new Date(`${value}T00:00:00.000Z`));

const optionalDateField = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? new Date(`${value}T00:00:00.000Z`) : null));

const sellerSchema = z.object({
  sellerCode: z.string().trim().min(2),
  workdayEmployeeId: optionalString,
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  employeeType: z.enum(["WORKDAY_EMPLOYEE", "LOCAL_HIRE", "NON_EMPLOYEE"]),
  isFullTime: z.string().optional().transform((value) => value === "on"),
  managerSellerId: optionalString,
  effectiveStartDate: dateField,
  effectiveEndDate: optionalDateField
});

const roleSchema = z.object({
  name: z.string().trim().min(2),
  category: z.enum(["DIRECT_SELLER", "LPS_FARM_GATE_SELLER", "OVERLAY_SELLER", "MANAGER_ROLLUP", "FUTURE_ROLE"]),
  behavior: z.enum(["SPLIT", "SPLIT_WITH_LIMIT", "ADDITIVE", "ROLLUP", "CONFIGURABLE"]),
  splitRequiredTotal: optionalString,
  splitMaximum: optionalString,
  isEligibleForCredit: z.string().optional().transform((value) => value === "on"),
  effectiveStartDate: dateField,
  effectiveEndDate: optionalDateField
});

const customerSchema = z.object({
  customerCode: z.string().trim().min(2),
  sapCustomerId: optionalString,
  salesforceAccountId: optionalString,
  name: z.string().trim().min(2),
  salesParent: z.string().trim().min(2),
  effectiveStartDate: dateField,
  effectiveEndDate: optionalDateField
});

const productGroupSchema = z.object({
  productGroupCode: z.string().trim().min(2),
  externalProductGroupId: optionalString,
  name: z.string().trim().min(2),
  metricType: z.enum(["QUANTITY", "AMOUNT", "BOTH"]),
  effectiveStartDate: dateField,
  effectiveEndDate: optionalDateField
});

function decimalFromOptional(value: string | null) {
  if (!value) {
    return null;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    throw new Error("Split thresholds must be positive numbers.");
  }

  return new Prisma.Decimal(numeric);
}

async function getActorUserId() {
  const user = await prisma.demoUser.findFirst({
    where: {
      role: "SALES_COMP_ADMIN",
      active: true
    },
    select: {
      id: true
    }
  });

  return user?.id ?? null;
}

async function createAuditLog(objectType: string, objectId: string, action: string, newValue: unknown, comment: string) {
  await prisma.auditLog.create({
    data: {
      objectType,
      objectId,
      action,
      actorUserId: await getActorUserId(),
      newValueJson: JSON.stringify(newValue),
      comment
    }
  });
}

export async function createSeller(formData: FormData) {
  await requirePermission("sellers:manage");
  const parsed = sellerSchema.parse(Object.fromEntries(formData));

  const seller = await prisma.seller.create({
    data: {
      ...parsed,
      workdayEmployeeId: parsed.employeeType === "WORKDAY_EMPLOYEE" ? parsed.workdayEmployeeId : null
    }
  });

  await createAuditLog("Seller", seller.id, "CREATE", { sellerCode: seller.sellerCode, name: seller.name }, "Created seller profile from setup screen.");
  revalidatePath("/sellers");
  redirect("/sellers?created=seller");
}

export async function updateSeller(formData: FormData) {
  await requirePermission("sellers:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const parsed = sellerSchema.parse(Object.fromEntries(formData));

  if (parsed.managerSellerId === id) {
    throw new Error("A seller cannot be their own manager.");
  }

  const seller = await prisma.seller.update({
    where: { id },
    data: {
      ...parsed,
      workdayEmployeeId: parsed.employeeType === "WORKDAY_EMPLOYEE" ? parsed.workdayEmployeeId : null
    }
  });

  await createAuditLog("Seller", seller.id, "UPDATE", { sellerCode: seller.sellerCode, name: seller.name }, "Updated seller profile from setup screen.");
  revalidatePath("/sellers");
  redirect("/sellers?created=seller-updated");
}

export async function createRole(formData: FormData) {
  await requirePermission("roles:manage");
  const parsed = roleSchema.parse(Object.fromEntries(formData));

  const role = await prisma.role.create({
    data: {
      ...parsed,
      splitRequiredTotal: decimalFromOptional(parsed.splitRequiredTotal),
      splitMaximum: decimalFromOptional(parsed.splitMaximum)
    }
  });

  await createAuditLog("Role", role.id, "CREATE", { name: role.name, behavior: role.behavior }, "Created role configuration from setup screen.");
  revalidatePath("/roles");
  redirect("/roles?created=role");
}

export async function updateRole(formData: FormData) {
  await requirePermission("roles:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const parsed = roleSchema.parse(Object.fromEntries(formData));

  const role = await prisma.role.update({
    where: { id },
    data: {
      ...parsed,
      splitRequiredTotal: decimalFromOptional(parsed.splitRequiredTotal),
      splitMaximum: decimalFromOptional(parsed.splitMaximum)
    }
  });

  await createAuditLog("Role", role.id, "UPDATE", { name: role.name, behavior: role.behavior }, "Updated role configuration from setup screen.");
  revalidatePath("/roles");
  redirect("/roles?created=role-updated");
}

export async function createCustomer(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const parsed = customerSchema.parse(Object.fromEntries(formData));

  const customer = await prisma.customer.create({
    data: parsed
  });

  await createAuditLog("Customer", customer.id, "CREATE", { customerCode: customer.customerCode, name: customer.name }, "Created customer from setup screen.");
  revalidatePath("/customers-products");
  redirect("/customers-products?created=customer");
}

export async function updateCustomer(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const parsed = customerSchema.parse(Object.fromEntries(formData));

  const customer = await prisma.customer.update({
    where: { id },
    data: parsed
  });

  await createAuditLog("Customer", customer.id, "UPDATE", { customerCode: customer.customerCode, name: customer.name }, "Updated customer from setup screen.");
  revalidatePath("/customers-products");
  redirect("/customers-products?created=customer-updated");
}

export async function createProductGroup(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const parsed = productGroupSchema.parse(Object.fromEntries(formData));

  const productGroup = await prisma.productGroup.create({
    data: parsed
  });

  await createAuditLog(
    "ProductGroup",
    productGroup.id,
    "CREATE",
    { productGroupCode: productGroup.productGroupCode, name: productGroup.name },
    "Created product group from setup screen."
  );
  revalidatePath("/customers-products");
  redirect("/customers-products?created=product-group");
}

export async function updateProductGroup(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const parsed = productGroupSchema.parse(Object.fromEntries(formData));

  const productGroup = await prisma.productGroup.update({
    where: { id },
    data: parsed
  });

  await createAuditLog(
    "ProductGroup",
    productGroup.id,
    "UPDATE",
    { productGroupCode: productGroup.productGroupCode, name: productGroup.name },
    "Updated product group from setup screen."
  );
  revalidatePath("/customers-products");
  redirect("/customers-products?created=product-group-updated");
}

export async function toggleSellerActive(formData: FormData) {
  await requirePermission("sellers:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const active = formData.get("active") === "true";

  const seller = await prisma.seller.update({
    where: { id },
    data: { active }
  });

  await createAuditLog("Seller", seller.id, active ? "ACTIVATE" : "DEACTIVATE", { active }, "Updated seller active status from setup screen.");
  revalidatePath("/sellers");
}

export async function toggleRoleActive(formData: FormData) {
  await requirePermission("roles:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const active = formData.get("active") === "true";

  const role = await prisma.role.update({
    where: { id },
    data: { active }
  });

  await createAuditLog("Role", role.id, active ? "ACTIVATE" : "DEACTIVATE", { active }, "Updated role active status from setup screen.");
  revalidatePath("/roles");
}

export async function toggleCustomerActive(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const active = formData.get("active") === "true";

  const customer = await prisma.customer.update({
    where: { id },
    data: { active }
  });

  await createAuditLog("Customer", customer.id, active ? "ACTIVATE" : "DEACTIVATE", { active }, "Updated customer active status from setup screen.");
  revalidatePath("/customers-products");
}

export async function toggleProductGroupActive(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const active = formData.get("active") === "true";

  const productGroup = await prisma.productGroup.update({
    where: { id },
    data: { active }
  });

  await createAuditLog(
    "ProductGroup",
    productGroup.id,
    active ? "ACTIVATE" : "DEACTIVATE",
    { active },
    "Updated product group active status from setup screen."
  );
  revalidatePath("/customers-products");
}
