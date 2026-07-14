"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X, Minus } from "lucide-react";
import type { RequirementMatchItem } from "@/types";

interface RequirementMatchListProps {
  items: RequirementMatchItem[];
}

const statusConfig = {
  matched: { icon: Check, color: "text-green-500", label: "Matched" },
  partial: { icon: Minus, color: "text-yellow-500", label: "Partial" },
  missing: { icon: X, color: "text-red-500", label: "Missing" },
};

export function RequirementMatchList({ items }: RequirementMatchListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Requirement Match
      </h3>
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {items.map((item, i) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;
              return (
                <div key={i} className="flex items-start gap-3 py-1.5">
                  <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", config.color)} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{item.requirement}</span>
                    {item.evidence && (
                      <p className="text-sm text-muted-foreground mt-0.5">{item.evidence}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
            <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Matched</span>
            <span className="flex items-center gap-1"><Minus className="h-3 w-3 text-yellow-500" /> Partial</span>
            <span className="flex items-center gap-1"><X className="h-3 w-3 text-red-500" /> Missing</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
