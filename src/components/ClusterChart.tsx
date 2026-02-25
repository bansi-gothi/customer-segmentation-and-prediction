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

interface ScatterPlotAxes {
  x: { label: string; values: number[] };
  y: { label: string; values: number[] };
  color: string[];
  size: number[];
}

interface ClusterSummary {
  id: number;
  name?: string;
}

interface ClusterScatterChartProps {
  data: any[];
  clusters: ClusterSummary[];
  scatterPlotAxes: ScatterPlotAxes;
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

const ClusterScatterChart = ({
  data,
  clusters,
  scatterPlotAxes,
}: ClusterScatterChartProps) => {
  if (!data?.length || !scatterPlotAxes) return null;

  // Preprocess data into scatter-friendly format
  const scatterData = data.map((_, idx) => ({
    x: scatterPlotAxes.x.values[idx],
    y: scatterPlotAxes.y.values[idx],
    clusterName: scatterPlotAxes.color[idx],
    size: scatterPlotAxes.size[idx],
  }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Customer Groups
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Segmentation by {scatterPlotAxes.x.label} vs {scatterPlotAxes.y.label}
      </p>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
            <XAxis
              type="number"
              dataKey="x"
              name={scatterPlotAxes.x.label}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              label={{
                value: scatterPlotAxes.x.label,
                position: "insideBottom",
                offset: -10,
                fill: "hsl(215 20% 55%)",
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={scatterPlotAxes.y.label}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              label={{
                value: scatterPlotAxes.y.label,
                angle: -90,
                position: "insideLeft",
                fill: "hsl(215 20% 55%)",
                fontSize: 12,
              }}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              wrapperStyle={{
                paddingTop: 30,
                fontSize: "12px",
              }}
            />

            {clusters.map((cluster, i) => {
              const clusterData = scatterData.filter(
                (row) => row.clusterName === cluster.name,
              );

              return (
                <Scatter
                  key={cluster.id}
                  name={cluster.name || `Cluster ${cluster.id}`}
                  data={clusterData}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.75}
                  r={5}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClusterScatterChart;
