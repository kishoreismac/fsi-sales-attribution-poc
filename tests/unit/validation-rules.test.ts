import { describe, expect, it } from "vitest";
import { dateRangesOverlap, directSplitTotal, hasOverlappingApprovedSellerRole, lpsSplitTotal } from "@/lib/validation/rules";

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

describe("assignment validation rules", () => {
  it("detects overlapping open-ended date ranges", () => {
    expect(dateRangesOverlap(date("2026-01-01"), null, date("2026-07-01"), date("2026-12-31"))).toBe(true);
    expect(dateRangesOverlap(date("2026-01-01"), date("2026-03-31"), date("2026-04-01"), null)).toBe(false);
  });

  it("calculates direct seller split totals", () => {
    const total = directSplitTotal([
      baseAssignment("a1", "SPLIT", 80),
      baseAssignment("a2", "SPLIT", 20),
      baseAssignment("a3", "ADDITIVE", 25)
    ]);

    expect(total).toBe(100);
  });

  it("calculates LPS split-with-limit totals", () => {
    const total = lpsSplitTotal([
      baseAssignment("a1", "SPLIT_WITH_LIMIT", 60),
      baseAssignment("a2", "SPLIT_WITH_LIMIT", 45),
      baseAssignment("a3", "SPLIT", 100)
    ]);

    expect(total).toBe(105);
  });

  it("detects overlapping approved assignments for the same seller and role", () => {
    const target = baseAssignment("draft", "SPLIT", 100, "seller-1", "role-1", "SUBMITTED");
    const group = [
      target,
      baseAssignment("approved", "SPLIT", 100, "seller-1", "role-1", "APPROVED"),
      baseAssignment("other-role", "SPLIT", 100, "seller-1", "role-2", "APPROVED")
    ];

    expect(hasOverlappingApprovedSellerRole(target, group)).toBe(true);
  });
});

function baseAssignment(
  id: string,
  behavior: string,
  allocationPercent: number,
  sellerId = "seller",
  roleId = "role",
  status = "SUBMITTED"
) {
  return {
    id,
    sellerId,
    roleId,
    allocationPercent,
    startDate: date("2026-01-01"),
    endDate: null,
    status,
    role: {
      behavior
    }
  };
}

