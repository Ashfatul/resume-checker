"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackItem } from "./feedback-item";
import { cn } from "@/lib/utils";
import type { FeedbackItem as FeedbackItemType, FeedbackSeverity } from "@/types";

interface FeedbackListProps {
  items: FeedbackItemType[];
}

const filters: { value: FeedbackSeverity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "suggestion", label: "Suggestions" },
];

export function FeedbackList({ items }: FeedbackListProps) {
  const [filter, setFilter] = useState<FeedbackSeverity | "all">("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.severity === filter);

  const counts: Record<string, number> = {
    all: items.length,
    critical: items.filter((i) => i.severity === "critical").length,
    major: items.filter((i) => i.severity === "major").length,
    minor: items.filter((i) => i.severity === "minor").length,
    suggestion: items.filter((i) => i.severity === "suggestion").length,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Detailed Feedback
      </h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
            className="text-xs"
          >
            {f.label}
            {counts[f.value] > 0 && (
              <span className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                filter === f.value ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {counts[f.value]}
              </span>
            )}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <FeedbackItem key={`${item.title}-${i}`} item={item} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No feedback items in this category.
          </p>
        )}
      </div>
    </div>
  );
}
