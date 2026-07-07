import { describe, expect, it } from "vitest";
import { lifecycleStatusLabel } from "@/lib/assignments/lifecycle";

describe("assignment lifecycle display", () => {
  const asOf = new Date("2026-07-07T12:00:00.000Z");

  it("shows approved assignments as active when the start date has arrived", () => {
    expect(
      lifecycleStatusLabel({
        status: "APPROVED",
        isEligibleForCredit: true,
        startDate: new Date("2026-07-07T00:00:00.000Z"),
        endDate: null,
        asOf
      })
    ).toBe("Active For Crediting");
  });

  it("keeps future approved assignments separate until the start date", () => {
    expect(
      lifecycleStatusLabel({
        status: "APPROVED",
        isEligibleForCredit: true,
        startDate: new Date("2026-10-01T00:00:00.000Z"),
        endDate: null,
        asOf
      })
    ).toBe("Future Approved For Crediting");
  });

  it("shows visibility-only approved assignments as active visibility records when current", () => {
    expect(
      lifecycleStatusLabel({
        status: "APPROVED",
        isEligibleForCredit: false,
        startDate: new Date("2026-07-01T00:00:00.000Z"),
        endDate: null,
        asOf
      })
    ).toBe("Active For Visibility");
  });
});
