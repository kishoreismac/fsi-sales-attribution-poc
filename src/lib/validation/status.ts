import type { AssignmentStatus, ValidationResult } from "@prisma/client";

export type ValidationDisplayStatus = "Passed" | "Warning" | "Error" | "Not Applicable";

export function isValidationApplicable(status: AssignmentStatus | string) {
  return status !== "EXPIRED" && status !== "REJECTED";
}

export function validationStatusFor(
  assignmentStatus: AssignmentStatus | string,
  validationResults: Pick<ValidationResult, "severity">[]
): ValidationDisplayStatus {
  if (!isValidationApplicable(assignmentStatus)) {
    return "Not Applicable";
  }

  if (validationResults.some((result) => result.severity === "ERROR")) {
    return "Error";
  }

  if (validationResults.some((result) => result.severity === "WARNING")) {
    return "Warning";
  }

  return "Passed";
}
