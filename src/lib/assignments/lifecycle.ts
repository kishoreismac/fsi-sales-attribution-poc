import { formatEnum } from "@/lib/setup-options";

function startOfUtcDay(value: Date) {
  return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}

export function isCurrentlyEffective(startDate: Date, endDate: Date | null, asOf = new Date()) {
  const currentDay = startOfUtcDay(asOf);
  const startDay = startOfUtcDay(startDate);
  const endDay = endDate ? startOfUtcDay(endDate) : null;

  return startDay <= currentDay && (!endDay || endDay >= currentDay);
}

export function lifecycleStatusLabel({
  status,
  isEligibleForCredit,
  startDate,
  endDate,
  asOf
}: {
  status: string;
  isEligibleForCredit: boolean;
  startDate: Date;
  endDate: Date | null;
  asOf?: Date;
}) {
  if (status === "ACTIVE" || (status === "APPROVED" && isCurrentlyEffective(startDate, endDate, asOf))) {
    return isEligibleForCredit ? "Active For Crediting" : "Active For Visibility";
  }

  if (status === "APPROVED") {
    return isEligibleForCredit ? "Future Approved For Crediting" : "Future Approved For Visibility";
  }

  return formatEnum(status);
}
