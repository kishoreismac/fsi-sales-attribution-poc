const ruleDisplay: Record<string, { label: string; fix: string }> = {
  DATE_ORDER: {
    label: "Date range needs correction",
    fix: "Set the end date after the start date, or leave the end date open."
  },
  INACTIVE_SELLER: {
    label: "Seller is inactive",
    fix: "Reactivate the seller or choose an active seller before approval."
  },
  DIRECT_SPLIT_TOTAL: {
    label: "Direct seller split total",
    fix: "Adjust direct seller allocations for this customer/product/date group until they total 100%."
  },
  LPS_SPLIT_MAX: {
    label: "LPS split limit",
    fix: "Keep LPS allocation at 100% or less for this customer/product/date group."
  },
  OVERLAY_ADDITIVE: {
    label: "Overlay is additive",
    fix: "No action needed. Overlay credit does not reduce direct seller split."
  },
  DATE_OVERLAP: {
    label: "Overlapping approved assignment",
    fix: "Change dates or expire the overlapping approved assignment for the same seller and role."
  }
};

export function validationRuleLabel(ruleCode: string) {
  return ruleDisplay[ruleCode]?.label ?? ruleCode;
}

export function validationRuleFix(ruleCode: string) {
  return ruleDisplay[ruleCode]?.fix ?? "Review the assignment details and rerun validation.";
}
