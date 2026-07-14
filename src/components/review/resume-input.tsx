"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "./file-dropzone";
import { MAX_TEXT_LENGTH } from "@/lib/constants";
import { validateUrl } from "@/lib/validators";
import { Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ResumeSource } from "@/types";

interface ResumeInputProps {
  value: string;
  onChange: (text: string, source: ResumeSource, fileName?: string) => void;
}

export function ResumeInput({ value, onChange }: ResumeInputProps) {
  const [url, setUrl] = useState("");
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const handleFetchUrl = async () => {
    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setFetchingUrl(true);
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch URL");
      }

      const data = await res.json();
      onChange(data.text, "url");
      toast.success(`Fetched content from URL (${data.wordCount} words)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to fetch URL");
    } finally {
      setFetchingUrl(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-medium">Your Resume</Label>
        <p className="text-sm text-muted-foreground mt-0.5">
          Provide your resume in any format
        </p>
      </div>
      <Tabs defaultValue="text">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="url">From URL</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-3">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value, "text")}
            placeholder="Paste your resume text here..."
            rows={8}
            maxLength={MAX_TEXT_LENGTH}
            className="resize-y"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {value.length.toLocaleString()}/{MAX_TEXT_LENGTH.toLocaleString()}
          </p>
        </TabsContent>

        <TabsContent value="file" className="mt-3">
          <FileDropzone
            onFileParsed={(text, fileName) => onChange(text, "file", fileName)}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-portfolio.com/resume"
                className="pl-9"
              />
            </div>
            <Button onClick={handleFetchUrl} disabled={fetchingUrl || !url.trim()} variant="outline">
              {fetchingUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Fetch
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll extract the text content from the URL
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
