"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useSettingsStore } from "@/store/settings-store";
import { validateApiKey } from "@/lib/ai/providers";
import { DEFAULT_MODELS } from "@/lib/constants";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function ApiKeyForm({ apiKeyRef }: { apiKeyRef: React.RefObject<HTMLInputElement | null> }) {
  const { provider, model, ollamaUrl, setModel, setOllamaUrl } = useSettingsStore();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null);

  if (!provider) return null;

  const handleValidate = async () => {
    setValidating(true);
    setValidation(null);
    try {
      const result = await validateApiKey(provider, apiKey, ollamaUrl);
      setValidation(result);
      if (result.valid) toast.success("Connection verified!");
      else toast.error(result.error || "Validation failed");
    } catch {
      setValidation({ valid: false, error: "Validation failed" });
    } finally {
      setValidating(false);
    }
  };

  if (provider === "ollama") {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="ollama-url">Server URL</Label>
            <Input
              id="ollama-url"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model || ""}
              onChange={(e) => setModel(e.target.value)}
              placeholder={DEFAULT_MODELS.ollama}
            />
            <p className="text-xs text-muted-foreground">
              Enter the model name installed on your Ollama server
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleValidate} disabled={validating} variant="outline" size="sm">
              {validating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Check Connection
            </Button>
            {validation && (
              <span className="flex items-center gap-1.5 text-sm">
                {validation.valid ? (
                  <><CheckCircle2 className="h-4 w-4 text-green-500" /> Connected</>
                ) : (
                  <><XCircle className="h-4 w-4 text-red-500" /> {validation.error}</>
                )}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground rounded-md bg-muted p-3">
            Ollama runs on your machine. No API key needed. No data leaves your computer at all.
          </p>
        </CardContent>
      </Card>
    );
  }

  const helpLinks: Record<string, { url: string; label: string }> = {
    gemini: { url: "https://aistudio.google.com/apikey", label: "Get a Gemini API key" },
    openai: { url: "https://platform.openai.com/api-keys", label: "Get an OpenAI API key" },
  };
  const help = helpLinks[provider];

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              ref={apiKeyRef}
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setValidation(null); }}
              placeholder={provider === "gemini" ? "AIza..." : "sk-..."}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {help && (
            <a href={help.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              {help.label} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="model-select">Model</Label>
          <Input
            id="model-select"
            value={model || ""}
            onChange={(e) => setModel(e.target.value)}
            placeholder={DEFAULT_MODELS[provider]}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleValidate} disabled={validating || !apiKey.trim()} variant="outline" size="sm">
            {validating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Validate Key
          </Button>
          {validation && (
            <span className="flex items-center gap-1.5 text-sm">
              {validation.valid ? (
                <><CheckCircle2 className="h-4 w-4 text-green-500" /> Key is valid</>
              ) : (
                <><XCircle className="h-4 w-4 text-red-500" /> {validation.error}</>
              )}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
