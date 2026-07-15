import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import * as mammoth from "mammoth";
import { createWorker } from "tesseract.js";
import {
  MAX_FILE_SIZE,
  JOB_OCR_TIMEOUT,
  SUPPORTED_EXTENSIONS,
  SUPPORTED_JOB_IMAGE_EXTENSIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

const ALL_SUPPORTED_EXTENSIONS = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_JOB_IMAGE_EXTENSIONS];

export async function POST(request: NextRequest) {
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File must be under 5 MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.` },
        { status: 413 }
      );
    }

    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ALL_SUPPORTED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${ext}. We support PDF, DOC, DOCX, PNG, JPG, JPEG, and WebP.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (ext === ".pdf") {
      const pdf = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await pdf.getText();
      text = result.text;
      await pdf.destroy();
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      // Image → OCR
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("OCR_TIMEOUT")), JOB_OCR_TIMEOUT);
      });
      worker = await createWorker("eng");
      text = await Promise.race([
        worker.recognize(buffer).then((r) => r.data.text),
        timeoutPromise,
      ]);
    }

    const trimmed = text.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({ text: trimmed, wordCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "OCR_TIMEOUT") {
      return NextResponse.json(
        { error: "Reading the image took too long. Try a smaller or clearer image." },
        { status: 408 }
      );
    }
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Please try a different file." },
      { status: 500 }
    );
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // worker may already be torn down; ignore
      }
    }
  }
}
