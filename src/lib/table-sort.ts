import type { SortDirection } from "@/components/ui/sort-link";

export type SortParams = {
  sort?: string;
  dir?: string;
};

export function sortDirection(value?: string): SortDirection {
  return value === "desc" ? "desc" : "asc";
}

function compareValues(left: string | number | Date | boolean | null | undefined, right: string | number | Date | boolean | null | undefined) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  if (left instanceof Date || right instanceof Date) {
    return new Date(left as string | number | Date).getTime() - new Date(right as string | number | Date).getTime();
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: "base" });
}

export function sortRows<T>(
  rows: T[],
  direction: SortDirection,
  getValue: (row: T) => string | number | Date | boolean | null | undefined
) {
  return [...rows].sort((left, right) => {
    const result = compareValues(getValue(left), getValue(right));
    return direction === "asc" ? result : -result;
  });
}
