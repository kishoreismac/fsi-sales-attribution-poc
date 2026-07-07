import { prisma } from "@/lib/db";
import { isCurrentlyEffective } from "@/lib/assignments/lifecycle";

export function listApprovedAssignmentExportRows() {
  return prisma.assignment.findMany({
    where: {
      status: {
        in: ["APPROVED", "ACTIVE"]
      }
    },
    include: {
      customer: true,
      productGroup: true,
      seller: true,
      role: true
    },
    orderBy: {
      assignmentNumber: "asc"
    }
  });
}

export async function listActiveAccountAssignmentStatementRows() {
  const assignments = await prisma.assignment.findMany({
    where: {
      status: {
        in: ["APPROVED", "ACTIVE"]
      },
      role: {
        isEligibleForCredit: true
      }
    },
    include: {
      customer: true,
      productGroup: true,
      seller: {
        include: {
          manager: true
        }
      },
      role: true
    },
    orderBy: [
      {
        customer: {
          name: "asc"
        }
      },
      {
        productGroup: {
          name: "asc"
        }
      },
      {
        seller: {
          name: "asc"
        }
      }
    ]
  });

  return assignments.filter((assignment) => isCurrentlyEffective(assignment.startDate, assignment.endDate));
}
