import { prisma } from "@/lib/db";

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

