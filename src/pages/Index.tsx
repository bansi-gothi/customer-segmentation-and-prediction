import { useState, useCallback } from "react";
import { Brain } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import MetricsCards from "@/components/MetricsCards";
import ClusterScatterChart from "@/components/ClusterChart";
import ClusterBarChart from "@/components/ClusterBarChart";
import PredictionTable from "@/components/PredictionTable";
import PredictionInsights from "@/components/PredictionInsights";
import { type CustomerData } from "@/lib/mockML";
import { downloadSampleCSV } from "@/utils/downloadSample";

interface MLResponse {
  metrics: any;
  clusters: { id: number; name: string; count: number }[];
  topCustomers: any[];
  scatterPlotAxes: any;
  prediction_charts: any;
  data: CustomerData[];
  error?: string;
  columns: string[];
}

const Index = () => {
  const [data, setData] = useState<CustomerData[] | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [clusters, setClusters] = useState<any[]>([]);
  const [scatterPlotAxes, setScatterPlotAxes] = useState<any | null>(null);
  const [predictionCharts, setPredictionCharts] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);
  const [topCustomers, setTopCustomers] = useState([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState("");

  const resetAnalyticsState = () => {
    setData(null);
    setMetrics(null);
    setClusters([]);
    setScatterPlotAxes(null);
    setTopCustomers([]);
    setColumns([]);
    setPredictionCharts(null);
  };

  const handleFile = useCallback(async (file: File) => {
    try {
      setProcessing(true);
      setError("");
      resetAnalyticsState();

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
      setPredictionCharts(result.prediction_charts);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while processing the file.");
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SegmentAI</h1>
            <p className="text-xs text-muted-foreground">
              Customer Intelligence Platform
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {processing && (
          <div className="glass-card p-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="font-medium">Running ML Pipeline...</p>
          </div>
        )}

        {!data && !processing && (
          <div className="grid md:grid-cols-2 gap-6 pt-12">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">
                Smart Customer Insights
              </h2>
              <p className="text-muted-foreground mt-4 max-w-md">
                Upload your customer data to discover customer groups and
                forecast business performance.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={downloadSampleCSV}
                className="px-4 py-2 rounded-md bg-primary text-white"
              >
                Download Sample CSV
              </button>

              <FileUpload
                onFileLoaded={(file) => handleFile(file)}
                hasData={false}
              />

              {error && <div className="text-warning">{error}</div>}
            </div>
          </div>
        )}

        {data && !processing && (
          <>
            <MetricsCards metrics={metrics} />

            <div className="grid lg:grid-cols-2 gap-6">
              <ClusterScatterChart
                data={data}
                clusters={clusters}
                scatterPlotAxes={scatterPlotAxes}
              />
              <ClusterBarChart clusters={clusters} />
            </div>

            {predictionCharts && (
              <PredictionInsights data={predictionCharts} clusters={clusters} />
            )}

            <PredictionTable data={topCustomers} columns={columns} />

            <div className="flex justify-center pt-4">
              <FileUpload onFileLoaded={handleFile} hasData />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
