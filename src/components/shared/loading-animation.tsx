"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { LOADING_TIPS, ANALYSIS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  progress: string[];
}

export function LoadingAnimation({ progress }: LoadingAnimationProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-12 w-12 text-primary" />
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-semibold">Analyzing your resume...</h2>
        <p className="mt-1 text-sm text-muted-foreground">This usually takes 15-30 seconds</p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {ANALYSIS_STEPS.map((step, i) => {
          const isComplete = progress.includes(step);
          const isActive = !isComplete && (i === 0 || progress.includes(ANALYSIS_STEPS[i - 1]));

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "flex items-center gap-3 text-sm",
                isComplete ? "text-foreground" : isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isComplete ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span>{step}</span>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-sm text-center text-sm text-muted-foreground italic"
        >
          Did you know? {LOADING_TIPS[tipIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
