import type { CustomerData } from "@/lib/mockML";

interface PredictionTableProps {
  data: CustomerData[];
}

const PredictionTable = ({ data }: PredictionTableProps) => {
  const sorted = [...data].sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0)).slice(0, 15);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">High-Value Predictions</h3>
      <p className="text-sm text-muted-foreground mb-4">Random Forest classifier top predictions</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Age", "Income", "Spending", "Freq", "Probability", "Prediction"].map((h) => (
                <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-2.5 px-3 font-mono text-muted-foreground">#{row.id}</td>
                <td className="py-2.5 px-3">{row.age}</td>
                <td className="py-2.5 px-3">${row.income}k</td>
                <td className="py-2.5 px-3">{row.spending}</td>
                <td className="py-2.5 px-3">{row.frequency}</td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(row.probability ?? 0) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{((row.probability ?? 0) * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.highValue
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {row.highValue ? "High Value" : "Standard"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionTable;
