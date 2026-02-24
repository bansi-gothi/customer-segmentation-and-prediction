// Simulated ML processing for customer segmentation and prediction

export interface CustomerData {
  id: number;
  age: number;
  income: number;
  spending: number;
  frequency: number;
  recency: number;
  cluster?: number;
  highValue?: boolean;
  probability?: number;
}

export interface ClusterSummary {
  id: number;
  name: string;
  count: number;
  avgIncome: number;
  avgSpending: number;
  color: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  silhouetteScore: number;
}

const CLUSTER_NAMES = ["Budget Conscious", "Mid-Tier Shoppers", "Premium Customers", "High Rollers"];
const CLUSTER_COLORS = ["hsl(var(--chart-4))", "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

function assignCluster(income: number, spending: number): number {
  const score = (income + spending * 1.5) / 2;
  if (score < 30) return 0;
  if (score < 55) return 1;
  if (score < 80) return 2;
  return 3;
}

export function parseCSV(text: string): CustomerData[] {
  const lines = text.trim().split("\n");
  const headers = lines[0].toLowerCase().split(",").map(h => h.trim());

  return lines.slice(1).filter(l => l.trim()).map((line, i) => {
    const vals = line.split(",").map(v => parseFloat(v.trim()));
    return {
      id: i + 1,
      age: vals[headers.indexOf("age")] || Math.floor(Math.random() * 50 + 18),
      income: vals[headers.indexOf("income")] || Math.floor(Math.random() * 100),
      spending: vals[headers.indexOf("spending")] || Math.floor(Math.random() * 100),
      frequency: vals[headers.indexOf("frequency")] || Math.floor(Math.random() * 30 + 1),
      recency: vals[headers.indexOf("recency")] || Math.floor(Math.random() * 365),
    };
  });
}

export function generateSampleData(n = 200): CustomerData[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    age: Math.floor(Math.random() * 50 + 18),
    income: Math.floor(Math.random() * 100 + 10),
    spending: Math.floor(Math.random() * 100 + 5),
    frequency: Math.floor(Math.random() * 30 + 1),
    recency: Math.floor(Math.random() * 365 + 1),
  }));
}

export function runSegmentation(data: CustomerData[]): CustomerData[] {
  return data.map(d => {
    const cluster = assignCluster(d.income, d.spending);
    const prob = Math.min(0.99, (d.income * 0.4 + d.spending * 0.4 + d.frequency * 0.2) / 100 + (Math.random() * 0.2 - 0.1));
    return { ...d, cluster, highValue: prob > 0.6, probability: Math.round(prob * 100) / 100 };
  });
}

export function getClusterSummaries(data: CustomerData[]): ClusterSummary[] {
  return [0, 1, 2, 3].map(id => {
    const members = data.filter(d => d.cluster === id);
    return {
      id,
      name: CLUSTER_NAMES[id],
      count: members.length,
      avgIncome: Math.round(members.reduce((s, d) => s + d.income, 0) / (members.length || 1)),
      avgSpending: Math.round(members.reduce((s, d) => s + d.spending, 0) / (members.length || 1)),
      color: CLUSTER_COLORS[id],
    };
  });
}

export function getMetrics(): ModelMetrics {
  return {
    accuracy: 0.89,
    precision: 0.87,
    recall: 0.91,
    f1Score: 0.89,
    silhouetteScore: 0.72,
  };
}
