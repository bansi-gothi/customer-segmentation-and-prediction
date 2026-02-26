import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Props {
  data: any;
  clusters: any[];
}

const COLORS = [
  "#f59e0b",
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#f87171",
  "#60a5fa",
  "#f472b6",
  "#fb923c",
];

const axisLine = { stroke: "hsl(222 30% 18%)" };
const tickStyle = { fill: "hsl(215 20% 65%)", fontSize: 12 };

const tooltipStyle = {
  backgroundColor: "hsl(222 40% 10%)",
  border: "1px solid hsl(222 30% 22%)",
  borderRadius: "0.75rem",
  padding: "0.5rem 1rem",
  color: "#ffffff",
};

export default function PredictionInsights({ data, clusters }: Props) {
  if (!data) return null;

  /* ---------------- Revenue ---------------- */
  const revenue = data?.revenue_forecast || {};

  const revenueData = [
    { name: "Current Revenue", value: revenue.current_total || 0 },
    { name: "Expected Next Month", value: revenue.expected_next_month || 0 },
    { name: "Revenue At Risk", value: revenue.revenue_at_risk || 0 },
  ];

  /* ---------------- Repeat Purchase ---------------- */
  const repeat = data?.repeat_purchase_likelihood || {};

  const likelihoodData = [
    { name: "Very Likely", value: repeat.very_likely || 0 },
    { name: "Possibly", value: repeat.possibly || 0 },
    { name: "Unlikely", value: repeat.unlikely || 0 },
  ];

  /* ---------------- Cluster ---------------- */
  const clusterRevenue = data?.cluster_expected_revenue || {};

  const clusterData = clusters?.map((cluster) => ({
    name: cluster.name,
    value: clusterRevenue[cluster.id] || 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Revenue Forecast */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-1">Revenue Forecast</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Current revenue vs next month projection
        </p>

        <div className="h-[320px]">
          <ResponsiveContainer>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="name" tick={tickStyle} axisLine={axisLine} />
              <YAxis tick={tickStyle} axisLine={axisLine} />
              <Tooltip
                contentStyle={tooltipStyle}
                wrapperStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {revenueData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Repeat Purchase Likelihood */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-1">
          Repeat Purchase Likelihood
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Probability of customers buying again
        </p>

        <div className="h-[320px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={likelihoodData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {likelihoodData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} fillOpacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                wrapperStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cluster Revenue */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-1">Cluster Revenue Outlook</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Expected revenue by customer segment
        </p>

        <div className="h-[320px]">
          <ResponsiveContainer>
            <BarChart data={clusterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="name" tick={tickStyle} axisLine={axisLine} />
              <YAxis tick={tickStyle} axisLine={axisLine} />
              <Tooltip
                contentStyle={tooltipStyle}
                wrapperStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {clusterData.map((_, i) => (
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
    </div>
  );
}
