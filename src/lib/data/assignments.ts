import { prisma } from "@/lib/db";

export function listAssignments() {
  return prisma.assignment.findMany({
    include: {
      customer: true,
      productGroup: true,
      seller: true,
      role: true,
      validationResults: true
    },
    orderBy: {
      assignmentNumber: "asc"
    }
  });
}

export function listSubmittedAssignments() {
  return prisma.assignment.findMany({
    where: {
      status: "SUBMITTED"
    },
    include: {
      customer: true,
      productGroup: true,
      seller: true,
      role: true,
      validationResults: true,
      approvalHistory: {
        include: {
          approver: true
        },
        orderBy: {
          decidedAt: "desc"
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export function getAssignmentById(id: string) {
  return prisma.assignment.findUnique({
    where: { id },
    include: {
      customer: true,
      productGroup: true,
      seller: true,
      role: true,
      validationResults: true,
      approvalHistory: {
        include: {
          approver: true
        }
      }
    }
  });
}
