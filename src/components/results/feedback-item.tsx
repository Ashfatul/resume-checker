"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SEVERITY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import type { FeedbackItem as FeedbackItemType } from "@/types";

interface FeedbackItemProps {
  item: FeedbackItemType;
  index: number;
}

export function FeedbackItem({ item, index }: FeedbackItemProps) {
  const config = SEVERITY_CONFIG[item.severity];

  return (
    <Card className={cn("border", config.border, config.bg)}>
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>{config.icon}</span>
            <span className={cn("text-xs font-semibold uppercase", config.color)}>
              {config.label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{item.category}</span>
        </div>
        <h4 className="font-medium text-sm">{item.title}</h4>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="flex items-start gap-2 rounded-md bg-background/50 p-2.5 text-sm">
          <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>{item.fix}</span>
        </div>
      </CardContent>
    </Card>
  );
}
