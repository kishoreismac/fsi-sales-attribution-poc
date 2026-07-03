import { prisma } from "@/lib/db";

export async function getDashboardData() {
  const [activeAssignments, pendingApproval, validationFailures, auditEvents, queue, recentAudit] = await Promise.all([
    prisma.assignment.count({
      where: {
        status: "ACTIVE"
      }
    }),
    prisma.assignment.count({
      where: {
        status: "SUBMITTED"
      }
    }),
    prisma.validationResult.count({
      where: {
        severity: "ERROR"
      }
    }),
    prisma.auditLog.count(),
    prisma.assignment.findMany({
      where: {
        OR: [
          { status: "SUBMITTED" },
          {
            validationResults: {
              some: {
                severity: "ERROR"
              }
            }
          }
        ]
      },
      include: {
        customer: true,
        productGroup: true,
        seller: true,
        role: true,
        validationResults: true
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 5
    }),
    prisma.auditLog.findMany({
      include: {
        actor: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    })
  ]);

  return {
    metrics: {
      activeAssignments,
      pendingApproval,
      validationFailures,
      auditEvents
    },
    queue,
    recentAudit
  };
}

