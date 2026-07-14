"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Stepper } from "@/components/shared/stepper";
import { ScoreOverview } from "@/components/results/score-overview";
import { CategoryScores } from "@/components/results/category-scores";
import { VerdictCard } from "@/components/results/verdict-card";
import { FeedbackList } from "@/components/results/feedback-list";
import { RequirementMatchList } from "@/components/results/requirement-match-list";
import { AiDisclaimer } from "@/components/results/ai-disclaimer";
import { useReviewStore } from "@/store/review-store";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const { analysisResult, reset } = useReviewStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  useEffect(() => {
    if (!analysisResult) {
      router.push("/review");
    }
  }, [analysisResult, router]);

  if (!analysisResult) return null;

  const scoreLabel =
    analysisResult.overallScore >= 80
      ? "Excellent"
      : analysisResult.overallScore >= 60
        ? "Good — with fixes"
        : analysisResult.overallScore >= 40
          ? "Needs work"
          : "Major improvements needed";

  const handleNewReview = () => {
    reset();
    router.push("/review");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleNewReview}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> New Review
            </button>
            <Stepper currentStep={2} />
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Results</h1>
            <Button variant="outline" size="sm" onClick={() => handlePrint()}>
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
          </div>

          <div ref={printRef} className="space-y-8 print:space-y-6">
            <div className="print:hidden flex justify-center">
              <ScoreOverview score={analysisResult.overallScore} label={scoreLabel} />
            </div>

            {/* Print-only header */}
            <div className="hidden print:block text-center border-b pb-4">
              <h2 className="text-xl font-bold">ResumeChecker — Resume Analysis Report</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Overall Score: {analysisResult.overallScore}/100 — {scoreLabel}
              </p>
            </div>

            <VerdictCard verdict={analysisResult.verdict} />
            <Separator />
            <CategoryScores categories={analysisResult.categories} />
            <Separator />
            <FeedbackList items={analysisResult.feedback} />
            <Separator />
            <RequirementMatchList items={analysisResult.requirementMatch} />
            <Separator />
            <AiDisclaimer metadata={analysisResult.metadata} />

            <div className="flex items-center justify-between pt-4 print:hidden">
              <Button variant="outline" onClick={handleNewReview}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Analyze Another
              </Button>
              <Button variant="outline" onClick={() => handlePrint()}>
                <Printer className="mr-1.5 h-3.5 w-3.5" /> Print Report
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
