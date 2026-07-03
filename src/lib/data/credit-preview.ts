import { prisma } from "@/lib/db";

export function listMockInvoices() {
  return prisma.mockInvoice.findMany({
    include: {
      customer: true,
      productGroup: true
    },
    orderBy: {
      invoiceNumber: "asc"
    }
  });
}

export function getMockInvoiceById(id: string) {
  return prisma.mockInvoice.findUnique({
    where: { id },
    include: {
      customer: true,
      productGroup: true
    }
  });
}

export async function getCreditPreview(invoiceId?: string) {
  const invoice =
    (invoiceId
      ? await prisma.mockInvoice.findUnique({
          where: { id: invoiceId },
          include: {
            customer: true,
            productGroup: true
          }
        })
      : await prisma.mockInvoice.findFirst({
          include: {
            customer: true,
            productGroup: true
          },
          orderBy: {
            invoiceNumber: "asc"
          }
        })) ?? null;

  if (!invoice) {
    return {
      invoice: null,
      rows: []
    };
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      customerId: invoice.customerId,
      productGroupId: invoice.productGroupId,
      status: {
        in: ["ACTIVE", "APPROVED"]
      },
      startDate: {
        lte: invoice.invoiceDate
      },
      OR: [
        {
          endDate: null
        },
        {
          endDate: {
            gte: invoice.invoiceDate
          }
        }
      ]
    },
    include: {
      seller: true,
      role: true,
      productGroup: true
    },
    orderBy: {
      assignmentNumber: "asc"
    }
  });

  const quantity = Number(invoice.quantity);
  const amount = Number(invoice.amount);

  const rows = assignments.map((assignment) => {
    const allocation = Number(assignment.allocationPercent);
    const metricType = assignment.productGroup.metricType;
    const creditedQuantity = metricType === "AMOUNT" ? null : (quantity * allocation) / 100;
    const creditedAmount = metricType === "QUANTITY" ? null : (amount * allocation) / 100;

    return {
      assignment,
      seller: assignment.seller,
      role: assignment.role,
      allocation,
      creditedQuantity,
      creditedAmount
    };
  }).filter((row) => row.role.isEligibleForCredit);

  return {
    invoice,
    rows
  };
}
