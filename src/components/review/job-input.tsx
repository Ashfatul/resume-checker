"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MAX_TEXT_LENGTH } from "@/lib/constants";

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobInput({ value, onChange }: JobInputProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="job-description" className="text-base font-medium">
          Job Description
        </Label>
        <p className="text-sm text-muted-foreground mt-0.5">
          Paste the full job posting text
        </p>
      </div>
      <Textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        rows={8}
        maxLength={MAX_TEXT_LENGTH}
        className="resize-y"
      />
      <p className="text-xs text-muted-foreground text-right">
        {value.length.toLocaleString()}/{MAX_TEXT_LENGTH.toLocaleString()}
      </p>
    </div>
  );
}
