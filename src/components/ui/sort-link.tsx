import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export function SortLink({
  label,
  sortKey,
  currentSort,
  currentDir,
  query
}: {
  label: string;
  sortKey: string;
  currentSort?: string;
  currentDir?: SortDirection;
  query?: Record<string, string | undefined>;
}) {
  const active = currentSort === sortKey;
  const nextDir: SortDirection = active && currentDir === "asc" ? "desc" : "asc";
  const Icon = active ? (currentDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  const params = new URLSearchParams();

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value && key !== "sort" && key !== "dir") {
        params.set(key, value);
      }
    }
  }

  params.set("sort", sortKey);
  params.set("dir", nextDir);

  return (
    <Link
      href={`?${params.toString()}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md py-1 text-left transition hover:text-foreground focus-visible:outline-none",
        active && "text-foreground"
      )}
      aria-label={`Sort by ${label} ${nextDir === "asc" ? "ascending" : "descending"}`}
    >
      <span>{label}</span>
      <Icon size={14} aria-hidden="true" />
    </Link>
  );
}
