import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { URL_FETCH_TIMEOUT, URL_MAX_SIZE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), URL_FETCH_TIMEOUT);

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "ResumeChecker/1.0 (Resume Content Fetcher)",
        },
      });
    } catch (e) {
      clearTimeout(timeout);
      if (e instanceof Error && e.name === "AbortError") {
        return NextResponse.json({ error: "URL fetch timed out (10s limit)" }, { status: 408 });
      }
      return NextResponse.json(
        { error: "Couldn't reach that URL. Make sure it's publicly accessible." },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `URL returned status ${response.status}` },
        { status: 502 }
      );
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > URL_MAX_SIZE) {
      return NextResponse.json({ error: "Page content is too large (2 MB limit)" }, { status: 413 });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $("script, style, nav, footer, header, aside, iframe, noscript, svg, form").remove();
    $("[role='navigation'], [role='banner'], [role='contentinfo']").remove();

    // Try to get main content first, then fall back to body
    let contentEl = $("main, article, [role='main']").first();
    if (!contentEl.length) contentEl = $("body");

    const title = $("title").text().trim();
    const text = contentEl
      .text()
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({ text, title, wordCount });
  } catch (error) {
    console.error("Fetch URL error:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL content" },
      { status: 500 }
    );
  }
}
