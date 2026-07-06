import { describe, expect, it } from "vitest";
import { isValidationApplicable, validationStatusFor } from "@/lib/validation/status";

describe("validation display status", () => {
  it("marks expired and rejected assignments as not applicable", () => {
    expect(isValidationApplicable("EXPIRED")).toBe(false);
    expect(isValidationApplicable("REJECTED")).toBe(false);
    expect(validationStatusFor("EXPIRED", [{ severity: "ERROR" }])).toBe("Not Applicable");
    expect(validationStatusFor("REJECTED", [{ severity: "WARNING" }])).toBe("Not Applicable");
  });

  it("separates validation health from approval lifecycle", () => {
    expect(validationStatusFor("ACTIVE", [])).toBe("Passed");
    expect(validationStatusFor("APPROVED", [{ severity: "INFO" }])).toBe("Passed");
    expect(validationStatusFor("SUBMITTED", [{ severity: "WARNING" }])).toBe("Warning");
    expect(validationStatusFor("SUBMITTED", [{ severity: "ERROR" }])).toBe("Error");
  });
});
