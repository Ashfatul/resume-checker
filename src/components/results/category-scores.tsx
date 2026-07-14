"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AnalysisCategories } from "@/types";

interface CategoryScoresProps {
  categories: AnalysisCategories;
}

const categoryLabels: Record<keyof AnalysisCategories, string> = {
  atsCompatibility: "ATS Compatibility",
  recruiterReadiness: "Recruiter Readiness",
  requirementMatch: "Requirement Match",
  contentQuality: "Content Quality",
};

export function CategoryScores({ categories }: CategoryScoresProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Category Breakdown
      </h3>
      <div className="space-y-3">
        {(Object.keys(categoryLabels) as (keyof AnalysisCategories)[]).map((key, i) => {
          const { score, summary } = categories[key];
          const color =
            score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";

          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{categoryLabels[key]}</span>
                <span className={cn(
                  "font-semibold",
                  score >= 80 ? "text-green-600 dark:text-green-400" :
                  score >= 60 ? "text-yellow-600 dark:text-yellow-400" :
                  "text-red-600 dark:text-red-400"
                )}>
                  {score}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
