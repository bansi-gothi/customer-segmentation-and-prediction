import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ClusterSummary } from "@/lib/mockML";

interface ClusterBarChartProps {
  clusters: ClusterSummary[];
}

const COLORS = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399"];

const ClusterBarChart = ({ clusters }: ClusterBarChartProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">Cluster Distribution</h3>
      <p className="text-sm text-muted-foreground mb-6">Customer count per segment</p>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clusters} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 40% 10%)",
                border: "1px solid hsl(222 30% 22%)",
                borderRadius: "0.5rem",
                color: "hsl(210 40% 92%)",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {clusters.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClusterBarChart;
