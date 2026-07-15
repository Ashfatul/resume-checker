"use client";

import { DocumentInput } from "./document-input";
import { validateFileType } from "@/lib/validators";
import {
  SUPPORTED_EXTENSIONS,
  SUPPORTED_JOB_IMAGE_EXTENSIONS,
} from "@/lib/constants";
import type { ResumeSource } from "@/types";

interface ResumeInputProps {
  value: string;
  onChange: (text: string, source: ResumeSource, fileName?: string) => void;
}

const ACCEPT = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_JOB_IMAGE_EXTENSIONS].join(",");

export function ResumeInput({ value, onChange }: ResumeInputProps) {
  return (
    <DocumentInput
      label="Your Resume"
      helper="Provide your resume in any format"
      value={value}
      onChange={(text) => onChange(text, "text")}
      file={{
        accept: ACCEPT,
        endpoint: "/api/parse",
        validate: validateFileType,
        supportedLabel: "PDF, DOC, DOCX, PNG, JPG, JPEG, WebP",
        prompt: "Drag & drop your resume",
        onParsed: (text, fileName) => onChange(text, "file", fileName),
      }}
      url={{
        placeholder: "https://your-portfolio.com/resume",
        onFetched: (text) => onChange(text, "url"),
      }}
    />
  );
}
