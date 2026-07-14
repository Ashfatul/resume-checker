import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIModel } from "@/lib/ai/providers";
import { SYSTEM_PROMPT, buildAnalysisPrompt } from "@/lib/ai/prompts";
import { analysisResultSchema } from "@/lib/ai/schema";
import { MAX_REQUEST_SIZE, ANALYSIS_TIMEOUT } from "@/lib/constants";
import type { AIProvider } from "@/types";

// Simple in-memory rate limiter
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  rateLimit.set(ip, recent);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = await request.json();
    const { jobDescription, resumeText, provider, apiKey, model, ollamaUrl } = body as {
      jobDescription: string;
      resumeText: string;
      provider: AIProvider;
      apiKey: string;
      model: string;
      ollamaUrl?: string;
    };

    if (!jobDescription?.trim() || !resumeText?.trim()) {
      return NextResponse.json(
        { error: "Both job description and resume text are required" },
        { status: 400 }
      );
    }

    if (!provider || !model) {
      return NextResponse.json(
        { error: "Provider and model are required" },
        { status: 400 }
      );
    }

    if (provider !== "ollama" && !apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    const schemaDescription = JSON.stringify({
      overallScore: "number (0-100)",
      categories: {
        atsCompatibility: { score: "number (0-100)", summary: "string" },
        recruiterReadiness: { score: "number (0-100)", summary: "string" },
        requirementMatch: { score: "number (0-100)", summary: "string" },
        contentQuality: { score: "number (0-100)", summary: "string" },
      },
      verdict: {
        decision: "APPLY | APPLY_WITH_IMPROVEMENTS | DO_NOT_APPLY",
        summary: "string",
      },
      feedback: [{
        severity: "critical | major | minor | suggestion",
        category: "string",
        title: "string",
        description: "string",
        fix: "string",
      }],
      requirementMatch: [{
        requirement: "string",
        status: "matched | partial | missing",
        evidence: "string (optional)",
      }],
    }, null, 2);

    const prompt = buildAnalysisPrompt(jobDescription, resumeText, schemaDescription);
    const aiModel = getAIModel(provider, apiKey || "ollama", model, ollamaUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT);

    try {
      const result = await generateText({
        model: aiModel,
        system: SYSTEM_PROMPT,
        prompt,
        abortSignal: controller.signal,
      });

      clearTimeout(timeout);

      // Parse the JSON response from AI
      let jsonText = result.text.trim();
      // Strip markdown code block markers if present
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        return NextResponse.json(
          { error: "The AI returned an unexpected response. Please try again." },
          { status: 502 }
        );
      }

      const validated = analysisResultSchema.safeParse(parsed);
      if (!validated.success) {
        return NextResponse.json(
          { error: "The AI response didn't match the expected format. Please try again." },
          { status: 502 }
        );
      }

      const analysisResult = {
        ...validated.data,
        metadata: {
          provider,
          model,
          timestamp: new Date().toISOString(),
        },
      };

      return NextResponse.json(analysisResult);
    } catch (e) {
      clearTimeout(timeout);
      if (e instanceof Error && e.name === "AbortError") {
        return NextResponse.json(
          { error: "The AI took too long to respond. This can happen with large resumes. Try again?" },
          { status: 408 }
        );
      }

      const message = e instanceof Error ? e.message : "Unknown error";
      // Check for auth errors
      if (message.includes("401") || message.includes("403") || message.includes("Unauthorized") || message.includes("Invalid")) {
        return NextResponse.json(
          { error: `Your API key was rejected by ${provider}. Please check it in Settings.` },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: `Analysis failed: ${message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
