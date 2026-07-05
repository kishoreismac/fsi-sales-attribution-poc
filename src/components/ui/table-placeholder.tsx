import { StatusBadge } from "@/components/ui/status-badge";

export function TablePlaceholder({
  rows
}: {
  rows: Array<Record<string, string>>;
}) {
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-surface shadow-panel">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3.5">
                    {column === "Status" ? <StatusBadge status={row[column]} /> : row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

