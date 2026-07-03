import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { TablePlaceholder } from "@/components/ui/table-placeholder";

export function ScreenStub({
  eyebrow,
  title,
  description,
  rows,
  emptyTitle,
  emptyDescription
}: {
  eyebrow: string;
  title: string;
  description: string;
  rows?: Array<Record<string, string>>;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      {rows && rows.length > 0 ? (
        <TablePlaceholder rows={rows} />
      ) : (
        <EmptyState
          title={emptyTitle ?? "No records yet"}
          description={emptyDescription ?? "Records will appear here once this workflow has data."}
        />
      )}
    </div>
  );
}

