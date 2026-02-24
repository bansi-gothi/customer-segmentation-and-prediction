import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CustomerData } from "@/lib/mockML";

interface ClusterChartProps {
  data: CustomerData[];
}

const COLORS = ["#f59e0b", "#38bdf8", "#a78bfa", "#34d399"];
const NAMES = ["Budget Conscious", "Mid-Tier Shoppers", "Premium Customers", "High Rollers"];

const ClusterChart = ({ data }: ClusterChartProps) => {
  const clusters = [0, 1, 2, 3].map((id) => data.filter((d) => d.cluster === id));

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">K-Means Customer Clusters</h3>
      <p className="text-sm text-muted-foreground mb-6">Income vs Spending Score segmentation</p>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
            <XAxis
              dataKey="income"
              name="Income"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
              label={{ value: "Annual Income (k$)", position: "bottom", fill: "hsl(215 20% 55%)", fontSize: 12 }}
            />
            <YAxis
              dataKey="spending"
              name="Spending"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
              label={{ value: "Spending Score", angle: -90, position: "insideLeft", fill: "hsl(215 20% 55%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 40% 10%)",
                border: "1px solid hsl(222 30% 22%)",
                borderRadius: "0.5rem",
                color: "hsl(210 40% 92%)",
              }}
            />
            <Legend wrapperStyle={{ color: "hsl(210 40% 92%)" }} />
            {clusters.map((cluster, i) => (
              <Scatter
                key={i}
                name={NAMES[i]}
                data={cluster}
                fill={COLORS[i]}
                fillOpacity={0.7}
                r={4}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClusterChart;
