import { FileCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex items-center gap-1.5">
          <FileCheck className="h-4 w-4" />
          <span>ResumeChecker</span>
          <span className="text-muted-foreground/50">·</span>
          <span>Open Source</span>
        </div>
        <div className="flex items-center gap-3">
          <span>MIT License</span>
          <span className="text-muted-foreground/50">·</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
