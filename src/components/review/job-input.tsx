"use client";

import { DocumentInput } from "./document-input";
import { validateFileType } from "@/lib/validators";
import {
  SUPPORTED_EXTENSIONS,
  SUPPORTED_JOB_IMAGE_EXTENSIONS,
} from "@/lib/constants";
import { Sparkles } from "lucide-react";
import type { JobDescriptionSource } from "@/types";

interface JobInputProps {
  value: string;
  onChange: (text: string, source: JobDescriptionSource) => void;
  source: JobDescriptionSource | null;
}

const ACCEPT = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_JOB_IMAGE_EXTENSIONS].join(",");

const SOURCE_HINTS: Record<Exclude<JobDescriptionSource, "text">, string> = {
  file: "Extracted from file — edit below if anything looks off",
  url: "Fetched from URL — edit below if anything looks off",
};

export function JobInput({ value, onChange, source }: JobInputProps) {
  return (
    <div className="space-y-3">
      <DocumentInput
        label="Job Description"
        helper="Provide the job description in any format"
        value={value}
        onChange={(text) => onChange(text, "text")}
        file={{
          accept: ACCEPT,
          endpoint: "/api/parse",
          validate: validateFileType,
          supportedLabel: "PDF, DOC, DOCX, PNG, JPG, JPEG, WebP",
          prompt: "Drag & drop a job description file or image",
          onParsed: (text) => onChange(text, "file"),
        }}
        url={{
          placeholder: "https://example.com/jobs/123",
          onFetched: (text) => onChange(text, "url"),
        }}
        uploadTabLabel="Upload File"
      />

      {value && source && source !== "text" && (
        <div className="flex items-center gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>{SOURCE_HINTS[source]}</span>
        </div>
      )}
    </div>
  );
}
