type AssignmentLike = {
  id: string;
  sellerId: string;
  roleId: string;
  allocationPercent: { toString(): string } | number | string;
  startDate: Date;
  endDate: Date | null;
  status: string;
  role: {
    behavior: string;
  };
};

export function dateRangesOverlap(startA: Date, endA: Date | null, startB: Date, endB: Date | null) {
  const aEnd = endA?.getTime() ?? Number.POSITIVE_INFINITY;
  const bEnd = endB?.getTime() ?? Number.POSITIVE_INFINITY;
  return startA.getTime() <= bEnd && startB.getTime() <= aEnd;
}

export function directSplitTotal(assignments: AssignmentLike[]) {
  return assignments
    .filter((item) => item.role.behavior === "SPLIT")
    .reduce((total, item) => total + Number(item.allocationPercent), 0);
}

export function lpsSplitTotal(assignments: AssignmentLike[]) {
  return assignments
    .filter((item) => item.role.behavior === "SPLIT_WITH_LIMIT")
    .reduce((total, item) => total + Number(item.allocationPercent), 0);
}

export function hasOverlappingApprovedSellerRole(assignment: AssignmentLike, group: AssignmentLike[]) {
  return group.some(
    (item) =>
      item.id !== assignment.id &&
      item.sellerId === assignment.sellerId &&
      item.roleId === assignment.roleId &&
      item.status === "APPROVED"
  );
}
