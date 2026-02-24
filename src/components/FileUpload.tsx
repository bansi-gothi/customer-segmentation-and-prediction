import { useCallback } from "react";
import { Upload, FileText } from "lucide-react";

interface FileUploadProps {
  onFileLoaded: (content: string) => void;
  hasData: boolean;
}

const FileUpload = ({ onFileLoaded, hasData }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        file.text().then(onFileLoaded);
      }
    },
    [onFileLoaded]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) file.text().then(onFileLoaded);
    },
    [onFileLoaded]
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="glass-card p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors group"
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {hasData ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary animate-pulse-glow" />
          )}
        </div>
        <div className="text-center">
          <p className="text-foreground font-semibold text-lg">
            {hasData ? "Dataset Loaded" : "Upload Customer CSV"}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {hasData
              ? "Drop a new file to replace"
              : "Drag & drop or click to browse"}
          </p>
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
