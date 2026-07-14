"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { label: "Settings", href: "/settings" },
  { label: "Review", href: "/review" },
  { label: "Results", href: "/results" },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-1 text-sm">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
              i < currentStep
                ? "bg-primary text-primary-foreground"
                : i === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span
            className={cn(
              "hidden sm:inline",
              i <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-1 h-px w-6 sm:w-10",
                i < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
