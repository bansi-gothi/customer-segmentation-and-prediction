import { useState, useCallback } from "react";
import { Brain, Sparkles } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import MetricsCards from "@/components/MetricsCards";
import ClusterChart from "@/components/ClusterChart";
import ClusterBarChart from "@/components/ClusterBarChart";
import PredictionTable from "@/components/PredictionTable";
import {
  parseCSV,
  generateSampleData,
  runSegmentation,
  getClusterSummaries,
  getMetrics,
  type CustomerData,
} from "@/lib/mockML";

const Index = () => {
  const [data, setData] = useState<CustomerData[] | null>(null);
  const [processing, setProcessing] = useState(false);

  const processData = useCallback((raw: CustomerData[]) => {
    setProcessing(true);
    setTimeout(() => {
      const segmented = runSegmentation(raw);
      setData(segmented);
      setProcessing(false);
    }, 1200);
  }, []);

  const handleFile = useCallback(
    (content: string) => {
      const parsed = parseCSV(content);
      processData(parsed.length > 0 ? parsed : generateSampleData());
    },
    [processData]
  );

  const handleDemo = useCallback(() => {
    processData(generateSampleData(250));
  }, [processData]);

  const clusters = data ? getClusterSummaries(data) : [];
  const metrics = getMetrics();

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
              <h1 className="text-lg font-bold text-foreground tracking-tight">SegmentAI</h1>
              <p className="text-xs text-muted-foreground">Customer Intelligence Platform</p>
            </div>
          </div>
          {!data && (
            <button
              onClick={handleDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Load Demo Data
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Processing overlay */}
        {processing && (
          <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-foreground font-medium">Running ML Pipeline...</p>
            <p className="text-muted-foreground text-sm">K-Means clustering & Random Forest classification</p>
          </div>
        )}

        {/* No data state */}
        {!data && !processing && (
          <div className="grid md:grid-cols-2 gap-6 pt-12">
            <div className="flex flex-col justify-center gap-6">
              <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="text-gradient">AI-Powered</span>
                <br />
                Customer Segmentation
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Upload your customer data and let machine learning uncover hidden segments and predict high-value customers instantly.
              </p>
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-secondary font-mono">K-Means</span>
                <span className="px-3 py-1 rounded-full bg-secondary font-mono">Random Forest</span>
                <span className="px-3 py-1 rounded-full bg-secondary font-mono">Analytics</span>
              </div>
            </div>
            <FileUpload onFileLoaded={handleFile} hasData={false} />
          </div>
        )}

        {/* Dashboard */}
        {data && !processing && (
          <>
            <MetricsCards metrics={metrics} data={data} clusters={clusters} />
            <div className="grid lg:grid-cols-2 gap-6">
              <ClusterChart data={data} />
              <ClusterBarChart clusters={clusters} />
            </div>
            <PredictionTable data={data} />
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
