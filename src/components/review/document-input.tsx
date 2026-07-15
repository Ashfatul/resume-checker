"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "./file-dropzone";
import { UrlInput } from "./url-input";
import { MAX_TEXT_LENGTH } from "@/lib/constants";

interface DocumentInputProps {
  label: string;
  helper: string;
  value: string;
  onChange: (text: string) => void;

  file: {
    accept: string;
    endpoint: string;
    validate: (name: string) => boolean;
    supportedLabel: string;
    prompt: string;
    onParsed: (text: string, fileName: string) => void;
  };

  url?: {
    placeholder?: string;
    onFetched: (text: string) => void;
  };

  showUrlTab?: boolean;
  uploadTabLabel?: string;
}

export function DocumentInput({
  label,
  helper,
  value,
  onChange,
  file,
  url,
  showUrlTab = true,
  uploadTabLabel = "Upload File",
}: DocumentInputProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground mt-0.5">{helper}</p>
      </div>

      <Tabs defaultValue="text">
        <TabsList className={showUrlTab ? "grid w-full grid-cols-3" : "grid w-full grid-cols-2"}>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">{uploadTabLabel}</TabsTrigger>
          {showUrlTab && <TabsTrigger value="url">From URL</TabsTrigger>}
        </TabsList>

        <TabsContent value="text" className="mt-3">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Paste the ${label.toLowerCase()} here...`}
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
            endpoint={file.endpoint}
            accept={file.accept}
            validate={file.validate}
            supportedLabel={file.supportedLabel}
            prompt={file.prompt}
            onFileParsed={file.onParsed}
          />
        </TabsContent>

        {showUrlTab && url && (
          <TabsContent value="url" className="mt-3">
            <UrlInput placeholder={url.placeholder} onFetched={url.onFetched} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
