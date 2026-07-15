"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";
import { validateUrl } from "@/lib/validators";
import { toast } from "sonner";

interface UrlInputProps {
  placeholder?: string;
  onFetched: (text: string) => void;
}

export function UrlInput({
  placeholder = "https://example.com/jobs/123",
  onFetched,
}: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleFetch = async () => {
    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }
    setFetching(true);
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch URL");
      }
      const data = await res.json();
      onFetched(data.text);
      toast.success(`Fetched content from URL (${data.wordCount} words)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to fetch URL");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
        <Button onClick={handleFetch} disabled={fetching || !url.trim()} variant="outline">
          {fetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Fetch
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We&apos;ll extract the text content from the URL
      </p>
    </div>
  );
}
