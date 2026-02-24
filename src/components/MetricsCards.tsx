import { TrendingUp, Users, DollarSign, Target, Brain, BarChart3 } from "lucide-react";
import type { ModelMetrics, CustomerData, ClusterSummary } from "@/lib/mockML";

interface MetricsCardsProps {
  metrics: ModelMetrics;
  data: CustomerData[];
  clusters: ClusterSummary[];
}

const MetricsCards = ({ metrics, data, clusters }: MetricsCardsProps) => {
  const highValueCount = data.filter((d) => d.highValue).length;
  const highValuePct = Math.round((highValueCount / data.length) * 100);

  const cards = [
    { label: "Total Customers", value: data.length.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "High-Value", value: `${highValuePct}%`, icon: TrendingUp, color: "text-success" },
    { label: "Clusters Found", value: clusters.filter(c => c.count > 0).length, icon: BarChart3, color: "text-accent" },
    { label: "Model Accuracy", value: `${(metrics.accuracy * 100).toFixed(1)}%`, icon: Brain, color: "text-primary" },
    { label: "Precision", value: `${(metrics.precision * 100).toFixed(1)}%`, icon: Target, color: "text-warning" },
    { label: "F1 Score", value: `${(metrics.f1Score * 100).toFixed(1)}%`, icon: DollarSign, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="glass-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <card.icon className={`w-4 h-4 ${card.color}`} />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <span className="text-2xl font-bold text-foreground">{card.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
