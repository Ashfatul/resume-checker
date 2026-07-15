import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
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

    let html = await response.text();

    // JSDOM does not support <script type="module"> natively. 
    // We rewrite them to standard deferred scripts so JSDOM can execute them.
    html = html.replace(/\btype\s*=\s*['"]?module['"]?/gi, "defer");

    const dom = new JSDOM(html, {
      url: url,
      runScripts: "dangerously",
      resources: {
        userAgent: "ResumeChecker/1.0 (Resume Content Fetcher)",
      },
      pretendToBeVisual: true,
      beforeParse(window) {
        // Mock window.matchMedia
        window.matchMedia = window.matchMedia || function() {
          return {
            matches: false,
            addListener: function() {},
            removeListener: function() {},
            addEventListener: function() {},
            removeEventListener: function() {},
            dispatchEvent: function() {}
          };
        };

        // Mock IntersectionObserver
        class IntersectionObserverMock {
          observe() {}
          unobserve() {}
          disconnect() {}
        }
        // @ts-ignore
        window.IntersectionObserver = window.IntersectionObserver || IntersectionObserverMock;

        // Mock ResizeObserver
        class ResizeObserverMock {
          observe() {}
          unobserve() {}
          disconnect() {}
        }
        // @ts-ignore
        window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;
      }
    });

    // Wait for client-side rendering (React/Next.js/etc.)
    let elapsed = 0;
    while (elapsed < 2000) {
      const document = dom.window.document;
      const bodyText = document.body?.textContent || "";
      const hasRootContent = document.getElementById("root")?.children.length ?? 0;
      const hasNextContent = document.getElementById("__next")?.children.length ?? 0;
      const hasAppContent = document.getElementById("app")?.children.length ?? 0;

      if (hasRootContent > 0 || hasNextContent > 0 || hasAppContent > 0 || bodyText.length > 500) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      elapsed += 100;
    }

    const document = dom.window.document;
    const title = document.title || "";

    // Remove non-content elements
    const elementsToRemove = document.querySelectorAll(
      "script, style, nav, footer, header, aside, iframe, noscript, svg, form, [role='navigation'], [role='banner'], [role='contentinfo']"
    );
    elementsToRemove.forEach((el) => el.remove());

    // Try to get main content first, then fall back to body
    let contentEl = document.querySelector("main, article, [role='main']");
    if (!contentEl) {
      contentEl = document.body;
    }

    const text = (contentEl?.textContent || "")
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Clean up JSDOM window memory
    dom.window.close();

    return NextResponse.json({ text, title, wordCount });
  } catch (error) {
    console.error("Fetch URL error:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL content" },
      { status: 500 }
    );
  }
}
