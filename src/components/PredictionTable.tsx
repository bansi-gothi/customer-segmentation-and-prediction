import type { CustomerData } from "@/lib/mockML";

interface PredictionTableProps {
  data: CustomerData[];
  columns: string[];
}

const PredictionTable = ({ data, columns }: PredictionTableProps) => {
  if (!data || data.length === 0) return null;

  // Sort by probability if available
  const sorted = [...data]
    .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))
    .slice(0, 20);

  // Hide technical/internal fields
  const hiddenColumns = ["cluster", "highValue"];

  const visibleColumns = columns.filter((col) => !hiddenColumns.includes(col));

  const formatHeader = (header: string) =>
    header.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") return value.toLocaleString();
    return String(value);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Top Customer Predictions
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        AI-powered high value customer analysis
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {visibleColumns.map((col) => (
                <th
                  key={col}
                  className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider"
                >
                  {formatHeader(col)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.map((row, index) => (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                {visibleColumns.map((col) => (
                  <td
                    key={col}
                    className="py-2.5 px-3 max-w-[180px] truncate"
                    title={formatValue(row[col])}
                  >
                    {formatValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionTable;
