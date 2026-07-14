import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { AIProvider } from "@/types";

export function getAIModel(
  provider: AIProvider,
  apiKey: string,
  model: string,
  ollamaUrl?: string
) {
  switch (provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey });
      return openai(model);
    }
    case "gemini": {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(model);
    }
    case "ollama": {
      const ollama = createOpenAI({
        baseURL: `${ollamaUrl || "http://localhost:11434"}/v1`,
        apiKey: "ollama",
      });
      return ollama(model);
    }
  }
}

export async function validateApiKey(
  provider: AIProvider,
  apiKey: string,
  ollamaUrl?: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    switch (provider) {
      case "gemini": {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (!res.ok) return { valid: false, error: "Invalid API key" };
        return { valid: true };
      }
      case "openai": {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) return { valid: false, error: "Invalid API key" };
        return { valid: true };
      }
      case "ollama": {
        const url = ollamaUrl || "http://localhost:11434";
        const res = await fetch(`${url}/api/tags`);
        if (!res.ok) return { valid: false, error: "Cannot connect to Ollama" };
        return { valid: true };
      }
    }
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : "Connection failed" };
  }
}
