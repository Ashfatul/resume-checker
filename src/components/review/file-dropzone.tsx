"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { validateFileSize, formatFileSize } from "@/lib/validators";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileDropzoneProps {
  onFileParsed: (text: string, fileName: string) => void;
  endpoint: string;
  accept: string;
  validate: (fileName: string) => boolean;
  supportedLabel: string;
  prompt: string;
}

export function FileDropzone({
  onFileParsed,
  endpoint,
  accept,
  validate,
  supportedLabel,
  prompt,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!validate(file.name)) {
        toast.error(`Unsupported file type. We support ${supportedLabel} files.`);
        return;
      }
      if (!validateFileSize(file.size)) {
        toast.error(`File must be under 5 MB. Your file is ${formatFileSize(file.size)}.`);
        return;
      }

      setParsing(true);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(endpoint, { method: "POST", body: formData });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to parse file");
        }

        const data = await res.json();
        onFileParsed(data.text, file.name);
        toast.success(`Parsed ${file.name} (${data.wordCount} words)`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to parse file");
        setFileName(null);
      } finally {
        setParsing(false);
      }
    },
    [accept, endpoint, onFileParsed, supportedLabel, validate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (fileName && !parsing) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <FileText className="h-5 w-5 text-primary" />
        <span className="flex-1 text-sm font-medium truncate">{fileName}</span>
        <button onClick={clear} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      {parsing ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      ) : (
        <Upload className="h-8 w-8 text-muted-foreground" />
      )}
      <div>
        <p className="text-sm font-medium">
          {parsing ? "Parsing file..." : prompt}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {supportedLabel} (max {formatFileSize(MAX_FILE_SIZE)})
        </p>
      </div>
      {!parsing && (
        <span className="text-xs text-primary font-medium">or Browse Files</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
