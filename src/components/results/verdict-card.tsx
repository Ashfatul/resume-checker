"use client";

import { Card, CardContent } from "@/components/ui/card";
import { VERDICT_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Verdict } from "@/types";

interface VerdictCardProps {
  verdict: Verdict;
}

export function VerdictCard({ verdict }: VerdictCardProps) {
  const config = VERDICT_CONFIG[verdict.decision];

  return (
    <Card className={cn("border-2", config.border, config.bg)}>
      <CardContent className="pt-6 text-center">
        <p className="text-3xl mb-2">{config.icon}</p>
        <h3 className={cn("text-lg font-bold", config.color)}>{config.label}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{verdict.summary}</p>
      </CardContent>
    </Card>
  );
}
