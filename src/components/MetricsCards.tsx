import { Users, TrendingUp, DollarSign, BarChart3, Repeat } from "lucide-react";

interface Metrics {
  avg_revenue_per_customer: number;
  avg_transactions_per_customer: number;
  total_customers: number;
  total_revenue: number;
  total_transactions: number;
}

interface PredictionSummaryProps {
  metrics: Metrics;
}

const formatNumber = (num: number) => num?.toLocaleString() ?? "0";

const formatCurrency = (num: number) =>
  `₹ ${
    num?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) ?? "0.00"
  }`;

const MetricsCards = ({ metrics }: PredictionSummaryProps) => {
  if (!metrics) return null;

  const cards = [
    {
      label: "Total Customers",
      value: formatNumber(metrics.total_customers),
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(metrics.total_revenue),
      icon: DollarSign,
      color: "text-success",
    },
    {
      label: "Avg Revenue / Customer",
      value: formatCurrency(metrics.avg_revenue_per_customer),
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "Total Transactions",
      value: formatNumber(metrics.total_transactions),
      icon: BarChart3,
      color: "text-warning",
    },
    {
      label: "Avg Transactions / Customer",
      value: metrics.avg_transactions_per_customer.toFixed(2),
      icon: Repeat,
      color: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {cards.map((card) => (
        <div key={card.label} className="glass-card p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
