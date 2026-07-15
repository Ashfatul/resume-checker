"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Circle, FileText, Sparkles } from "lucide-react";
import { LOADING_TIPS, ANALYSIS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  progress: string[];
  active: boolean;
}

export function LoadingAnimation({ progress, active }: LoadingAnimationProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .laser-scan-line {
          animation: scan 3s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/20 blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px] animate-pulse" />

      <div className="w-full max-w-lg px-6 flex flex-col items-center animate-slide-up">
        {/* Animated Laser Scanning Icon */}
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
          {/* Pulsing file icon */}
          <FileText className="h-14 w-14 text-blue-500 animate-pulse" />
          
          {/* Sparkles element */}
          <div className="absolute top-2 right-2 text-blue-400 animate-bounce">
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Laser Scanner Line */}
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_8px_#3b82f6] laser-scan-line" />
        </div>

        {/* Text Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Analyzing your resume...
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Our AI is evaluating ATS compatibility & requirements. This can take up to 3 minutes.
          </p>
        </div>

        {/* Steps Progress Card */}
        <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Analysis Progress
          </h3>
          <div className="space-y-4">
            {ANALYSIS_STEPS.map((step, i) => {
              const isComplete = progress.includes(step);
              const isActive = !isComplete && (i === 0 || progress.includes(ANALYSIS_STEPS[i - 1]));

              return (
                <div
                  key={step}
                  className={cn(
                    "flex items-center gap-3 text-sm font-medium transition-colors duration-300",
                    isComplete
                      ? "text-zinc-100"
                      : isActive
                      ? "text-blue-400"
                      : "text-zinc-600"
                  )}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {isComplete ? (
                      <Check className="h-4 w-4 text-green-500 stroke-[3px]" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-zinc-800" />
                    )}
                  </div>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Facts & Tips Card */}
        <div className="w-full min-h-[90px] flex flex-col items-center justify-center px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <span className="font-semibold text-blue-400 text-xs uppercase tracking-wider mb-1">💡 Career Insight</span>
          <p className="text-xs sm:text-sm text-zinc-300 italic">
            "{LOADING_TIPS[tipIndex]}"
          </p>
        </div>
      </div>
    </div>
  );
}
