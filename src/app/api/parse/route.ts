import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import * as mammoth from "mammoth";
import { MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File must be under 5 MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
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
      return NextResponse.json(
        { error: `Unsupported file type: ${ext}. We support PDF, DOC, and DOCX files.` },
        { status: 400 }
      );
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      text: text.trim(),
      wordCount,
    });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Please try a different file." },
      { status: 500 }
    );
  }
}
