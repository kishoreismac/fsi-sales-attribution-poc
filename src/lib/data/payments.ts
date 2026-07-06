import { prisma } from "@/lib/db";

const DEFAULT_INTERIM_RATE = 0.7;

export type PaymentProcessingRow = {
  sellerId: string;
  sellerName: string;
  sellerCode: string;
  invoiceCount: number;
  assignmentCount: number;
  grossCreditedAmount: number;
  interimPaymentAmount: number;
  trueUpReserveAmount: number;
};

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  return { start, end };
}

export async function getPaymentProcessingData(month = "2026-07", interimRate = DEFAULT_INTERIM_RATE) {
  const { start, end } = monthRange(month);
  const invoices = await prisma.mockInvoice.findMany({
    where: {
      invoiceDate: {
        gte: start,
        lt: end
      }
    },
    include: {
      customer: true,
      productGroup: true
    },
    orderBy: {
      invoiceNumber: "asc"
    }
  });

  const rowMap = new Map<string, PaymentProcessingRow>();
  let eligibleInvoiceCount = 0;

  for (const invoice of invoices) {
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
        ],
        role: {
          isEligibleForCredit: true
        }
      },
      include: {
        seller: true,
        role: true
      }
    });

    if (assignments.length > 0) {
      eligibleInvoiceCount += 1;
    }

    for (const assignment of assignments) {
      const allocation = Number(assignment.allocationPercent) / 100;
      const grossCreditedAmount = Number(invoice.amount) * allocation;
      const existing = rowMap.get(assignment.sellerId) ?? {
        sellerId: assignment.sellerId,
        sellerName: assignment.seller.name,
        sellerCode: assignment.seller.sellerCode,
        invoiceCount: 0,
        assignmentCount: 0,
        grossCreditedAmount: 0,
        interimPaymentAmount: 0,
        trueUpReserveAmount: 0
      };

      existing.invoiceCount += 1;
      existing.assignmentCount += 1;
      existing.grossCreditedAmount += grossCreditedAmount;
      existing.interimPaymentAmount += grossCreditedAmount * interimRate;
      existing.trueUpReserveAmount += grossCreditedAmount * (1 - interimRate);
      rowMap.set(assignment.sellerId, existing);
    }
  }

  const rows = Array.from(rowMap.values());
  const grossCreditedAmount = rows.reduce((total, row) => total + row.grossCreditedAmount, 0);
  const interimPaymentAmount = rows.reduce((total, row) => total + row.interimPaymentAmount, 0);
  const trueUpReserveAmount = rows.reduce((total, row) => total + row.trueUpReserveAmount, 0);

  return {
    month,
    interimRate,
    invoiceCount: invoices.length,
    eligibleInvoiceCount,
    sellerCount: rows.length,
    grossCreditedAmount,
    interimPaymentAmount,
    trueUpReserveAmount,
    rows
  };
}
