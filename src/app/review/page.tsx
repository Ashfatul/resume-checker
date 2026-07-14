"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Stepper } from "@/components/shared/stepper";
import { LoadingAnimation } from "@/components/shared/loading-animation";
import { JobInput } from "@/components/review/job-input";
import { ResumeInput } from "@/components/review/resume-input";
import { useSettingsStore } from "@/store/settings-store";
import { useReviewStore } from "@/store/review-store";
import { PROVIDER_LABELS, ANALYSIS_STEPS } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ReviewPage() {
  const router = useRouter();
  const { provider, model, ollamaUrl, isConfigured, hydrate, getApiKey } = useSettingsStore();
  const {
    jobDescription, resumeText, analysisStatus, analysisProgress,
    setJobDescription, setResumeText, setAnalysisResult, setAnalysisStatus,
    addProgress, setError,
  } = useReviewStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const settings = useSettingsStore.getState();
        if (!settings.isConfigured) {
          toast.error("Please configure your AI provider first");
          router.push("/settings");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    if (!resumeText.trim()) {
      toast.error("Please provide your resume");
      return;
    }

    setSubmitting(true);
    setAnalysisStatus("analyzing");
    setError(null);

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      const current = useReviewStore.getState().analysisProgress;
      const nextIndex = current.length;
      if (nextIndex < ANALYSIS_STEPS.length) {
        addProgress(ANALYSIS_STEPS[nextIndex]);
      }
    }, 4000);

    addProgress(ANALYSIS_STEPS[0]);

    try {
      const apiKey = provider !== "ollama" ? await getApiKey() : null;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeText,
          provider,
          apiKey: apiKey || "",
          model,
          ollamaUrl: provider === "ollama" ? ollamaUrl : undefined,
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const result = await res.json();
      setAnalysisResult(result);
      router.push("/results");
    } catch (e) {
      clearInterval(progressInterval);
      const message = e instanceof Error ? e.message : "Analysis failed";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (analysisStatus === "analyzing") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingAnimation progress={analysisProgress} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
            <Stepper currentStep={1} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Review Your Resume</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Provide the job description and your resume for analysis
              </p>
            </div>

            <JobInput value={jobDescription} onChange={setJobDescription} />
            <ResumeInput
              value={resumeText}
              onChange={(text, source, fileName) => setResumeText(text, source, fileName)}
            />

            {provider && (
              <Card>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Using: </span>
                    <span className="font-medium">
                      {PROVIDER_LABELS[provider] || provider}
                    </span>
                    {model && (
                      <span className="text-muted-foreground"> ({model})</span>
                    )}
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Settings className="h-3 w-3" /> Change
                  </Link>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting || !jobDescription.trim() || !resumeText.trim()}
              className="w-full"
              size="lg"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Analyze My Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
