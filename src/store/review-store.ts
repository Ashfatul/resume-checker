import { create } from "zustand";
import type { AnalysisResult, AnalysisStatus, ResumeSource } from "@/types";

interface ReviewStore {
  jobDescription: string;
  resumeText: string;
  resumeSource: ResumeSource;
  fileName: string | null;

  analysisResult: AnalysisResult | null;
  analysisStatus: AnalysisStatus;
  analysisProgress: string[];
  error: string | null;

  setJobDescription: (text: string) => void;
  setResumeText: (text: string, source: ResumeSource, fileName?: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setAnalysisStatus: (status: AnalysisStatus) => void;
  addProgress: (message: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  jobDescription: "",
  resumeText: "",
  resumeSource: "text",
  fileName: null,

  analysisResult: null,
  analysisStatus: "idle",
  analysisProgress: [],
  error: null,

  setJobDescription: (text) => set({ jobDescription: text }),

  setResumeText: (text, source, fileName) =>
    set({ resumeText: text, resumeSource: source, fileName: fileName ?? null }),

  setAnalysisResult: (result) =>
    set({ analysisResult: result, analysisStatus: "complete" }),

  setAnalysisStatus: (status) => set({ analysisStatus: status }),

  addProgress: (message) =>
    set((state) => ({ analysisProgress: [...state.analysisProgress, message] })),

  setError: (error) => set({ error, analysisStatus: error ? "error" : "idle" }),

  reset: () =>
    set({
      jobDescription: "",
      resumeText: "",
      resumeSource: "text",
      fileName: null,
      analysisResult: null,
      analysisStatus: "idle",
      analysisProgress: [],
      error: null,
    }),
}));
