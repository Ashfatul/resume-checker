import { MAX_FILE_SIZE, MAX_TEXT_LENGTH, SUPPORTED_EXTENSIONS } from "./constants";

export function validateFileType(fileName: string): boolean {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
  return SUPPORTED_EXTENSIONS.includes(ext);
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function validateTextLength(text: string): boolean {
  return text.length > 0 && text.length <= MAX_TEXT_LENGTH;
}

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
