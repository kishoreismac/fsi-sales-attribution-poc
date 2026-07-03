import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [sellers, editableSeller, roles, creditEligibleRoles, visibilityOnlyRoles, customers, productGroups, submitted, approvedOrActive, validationErrors, mockInvoices, invoiceWithTons] = await Promise.all([
    prisma.seller.count(),
    prisma.seller.findFirst({ where: { active: true, email: { not: "" } } }),
    prisma.role.count(),
    prisma.role.count({ where: { isEligibleForCredit: true } }),
    prisma.role.count({ where: { isEligibleForCredit: false } }),
    prisma.customer.count(),
    prisma.productGroup.count(),
    prisma.assignment.count({ where: { status: "SUBMITTED" } }),
    prisma.assignment.count({ where: { status: { in: ["APPROVED", "ACTIVE"] } } }),
    prisma.validationResult.count({ where: { severity: "ERROR" } }),
    prisma.mockInvoice.count(),
    prisma.mockInvoice.findFirst({ where: { quantityUnit: "tons", amount: { gt: 0 }, quantity: { gt: 0 } } })
  ]);

  const matchingInvoice = await prisma.mockInvoice.findFirst({
    include: {
      customer: true,
      productGroup: true
    }
  });

  const previewCoverage = matchingInvoice
    ? await prisma.assignment.count({
        where: {
          customerId: matchingInvoice.customerId,
          productGroupId: matchingInvoice.productGroupId,
          status: { in: ["APPROVED", "ACTIVE"] },
          role: { isEligibleForCredit: true }
        }
      })
    : 0;

  const failures: string[] = [];

  if (sellers < 6) failures.push(`Expected at least 6 sellers, found ${sellers}.`);
  if (!editableSeller) failures.push("Expected at least 1 active seller available for edit flow.");
  if (roles < 4) failures.push(`Expected at least 4 roles, found ${roles}.`);
  if (creditEligibleRoles < 1) failures.push("Expected at least 1 credit-eligible role for Credit Preview.");
  if (visibilityOnlyRoles < 1) failures.push("Expected at least 1 visibility-only role to test credit exclusion.");
  if (customers < 4) failures.push(`Expected at least 4 customers, found ${customers}.`);
  if (productGroups < 4) failures.push(`Expected at least 4 product groups, found ${productGroups}.`);
  if (submitted < 1) failures.push(`Expected at least 1 submitted assignment, found ${submitted}.`);
  if (approvedOrActive < 1) failures.push(`Expected approved/active assignments for preview/export, found ${approvedOrActive}.`);
  if (validationErrors < 1) failures.push("Expected at least 1 validation error for validator demo.");
  if (mockInvoices < 1) failures.push(`Expected at least 1 mock invoice, found ${mockInvoices}.`);
  if (!invoiceWithTons) failures.push("Expected at least 1 mock invoice with tons, quantity, and amount.");
  if (previewCoverage < 1) failures.push("Expected at least 1 mock invoice to have approved/active credit-eligible assignment coverage.");

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }

  console.log(
    JSON.stringify({
      sellers,
      customers,
      roles,
      creditEligibleRoles,
      visibilityOnlyRoles,
      productGroups,
      submitted,
      approvedOrActive,
      validationErrors,
      mockInvoices,
      previewCoverage
    })
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
