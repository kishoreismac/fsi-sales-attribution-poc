import { prisma } from "@/lib/db";

export async function listValidationGroups() {
  const results = await prisma.validationResult.findMany({
    include: {
      assignment: {
        include: {
          customer: true,
          productGroup: true,
          seller: true,
          role: true
        }
      }
    },
    orderBy: [
      {
        validationGroupKey: "asc"
      },
      {
        severity: "desc"
      },
      {
        ruleCode: "asc"
      }
    ]
  });

  const groups = new Map<string, typeof results>();

  for (const result of results) {
    const current = groups.get(result.validationGroupKey) ?? [];
    current.push(result);
    groups.set(result.validationGroupKey, current);
  }

  return Array.from(groups.entries()).map(([key, groupResults]) => {
    const first = groupResults[0];
    const errorCount = groupResults.filter((result) => result.severity === "ERROR").length;
    const warningCount = groupResults.filter((result) => result.severity === "WARNING").length;
    const infoCount = groupResults.filter((result) => result.severity === "INFO").length;

    return {
      key,
      customer: first.assignment.customer,
      productGroup: first.assignment.productGroup,
      startDate: first.assignment.startDate,
      status: errorCount > 0 ? "Error" : warningCount > 0 ? "Warning" : "Approved",
      errorCount,
      warningCount,
      infoCount,
      results: groupResults
    };
  });
}

export async function getValidationSummary() {
  const [errorCount, warningCount, infoCount, assignmentCount] = await Promise.all([
    prisma.validationResult.count({ where: { severity: "ERROR" } }),
    prisma.validationResult.count({ where: { severity: "WARNING" } }),
    prisma.validationResult.count({ where: { severity: "INFO" } }),
    prisma.assignment.count({
      where: {
        status: {
          notIn: ["REJECTED", "EXPIRED"]
        }
      }
    })
  ]);

  return {
    assignmentCount,
    errorCount,
    warningCount,
    infoCount
  };
}

