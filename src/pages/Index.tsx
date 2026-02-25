import { useState, useCallback } from "react";
import { Brain } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import MetricsCards from "@/components/MetricsCards";
import ClusterScatterChart from "@/components/ClusterChart";
import ClusterBarChart from "@/components/ClusterBarChart";
import PredictionTable from "@/components/PredictionTable";
import { type CustomerData } from "@/lib/mockML";

interface MLResponse {
  metrics: any;
  clusters: { id: number; name: string; count: number }[];
  topCustomers: any[];
  trends: any;
  scatterPlotAxes: {
    x: { label: string; values: number[] };
    y: { label: string; values: number[] };
    color: string[];
    size: number[];
  };
  data: CustomerData[];
  error?: string;
  columns: string[];
}

const Index = () => {
  const [data, setData] = useState<CustomerData[] | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [clusters, setClusters] = useState<any[]>([]);
  const [scatterPlotAxes, setScatterPlotAxes] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);
  const [topCustomers, setTopCustomers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (file: File) => {
    try {
      setProcessing(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/analytics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze file");
      }

      const result: MLResponse = await response.json();

      if (result.error) {
        setError(result.error);
        return;
      }

      setData(result.data);
      setMetrics(result.metrics);
      setClusters(result.clusters);
      setScatterPlotAxes(result.scatterPlotAxes);
      setTopCustomers(result.topCustomers);
      setColumns(result.columns);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                SegmentAI
              </h1>
              <p className="text-xs text-muted-foreground">
                Customer Intelligence Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Processing overlay */}
        {processing && (
          <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-foreground font-medium">
              Running ML Pipeline...
            </p>
          </div>
        )}

        {/* No data state */}
        {!data && !processing && (
          <div className="grid md:grid-cols-2 gap-6 pt-12">
            <div className="flex flex-col justify-center gap-6">
              <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="text-gradient">Smart</span>
                <br />
                Customer Insights
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Upload your customer data to instantly discover customer groups,
                identify your most valuable customers, and get actionable
                insights.
              </p>
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-secondary font-mono">
                  Grouping
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary font-mono">
                  Value Scoring
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary font-mono">
                  Analytics
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {/* Data Requirements Card */}
              <div className="bg-secondary/40 border border-border rounded-xl p-5 text-md space-y-3">
                <p className="font-semibold text-foreground">
                  📌 Smart Data Requirements
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    At least one numeric column (income, expenditure, invoice
                    amount)
                  </li>
                  <li>Two or more numeric columns for better clustering</li>
                  <li>
                    A date column (invoice_date, purchase_date) for trend
                    analysis
                  </li>
                  <li>
                    A customer identifier column for top customer insights
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground pt-2">
                  Supported format: CSV with headers.
                </p>
              </div>

              <FileUpload
                onFileLoaded={(file) => handleFile(file)}
                hasData={false}
              />
              {error && <div className="text-warning">{error}</div>}
            </div>
          </div>
        )}

        {/* Dashboard */}
        {data && !processing && scatterPlotAxes && (
          <>
            <MetricsCards metrics={metrics} data={data} clusters={clusters} />

            <div className="grid lg:grid-cols-2 gap-6">
              <ClusterScatterChart
                data={data}
                clusters={clusters}
                scatterPlotAxes={scatterPlotAxes}
              />
              <ClusterBarChart clusters={clusters} />
            </div>

            <PredictionTable data={topCustomers} columns={columns} />

            <div className="flex justify-center pt-2">
              <FileUpload onFileLoaded={handleFile} hasData={true} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
