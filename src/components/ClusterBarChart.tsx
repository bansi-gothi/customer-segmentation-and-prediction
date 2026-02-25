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

interface ClusterSummary {
  id: number;
  name: string;
  count: number;
}

interface ClusterBarChartProps {
  clusters: ClusterSummary[];
}

const ClusterBarChart = ({ clusters }: ClusterBarChartProps) => {
  if (!clusters?.length) return null;

  const COLORS = [
    "#f59e0b",
    "#38bdf8",
    "#a78bfa",
    "#34d399",
    "#f87171",
    "#60a5fa",
    "#f472b6",
    "#fb923c",
  ].slice(0, clusters.length);

  const hasLongLabels = clusters.some((c) => c.name && c.name.length > 10);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Cluster Distribution
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Number of customers in each group
      </p>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={clusters}
            margin={{
              top: 30,
              right: 30,
              bottom: hasLongLabels ? 60 : 40,
              left: 40,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              angle={hasLongLabels ? -25 : 0}
              textAnchor={hasLongLabels ? "end" : "middle"}
              interval={0}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(222 30% 18%)" }}
              allowDecimals={false}
              label={{
                value: "Customer Count",
                angle: -90,
                position: "insideLeft",
                fill: "hsl(215 20% 55%)",
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              labelFormatter={(label) => `${label}`}
              formatter={(value: number) => [`${value}`, "Customers"]}
              contentStyle={{
                backgroundColor: "hsl(222 40% 10%)",
                border: "1px solid hsl(222 30% 22%)",
                borderRadius: "0.75rem",
                padding: "0.5rem 1rem",
              }}
              itemStyle={{
                color: "hsl(210 40% 92%)", // color for value text
                fontSize: "0.875rem",
              }}
              labelStyle={{
                color: "hsl(210 40% 92%)", // color for label text
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {clusters.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClusterBarChart;
