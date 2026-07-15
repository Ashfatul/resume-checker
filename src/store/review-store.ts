import { create } from "zustand";
import type { AnalysisResult, AnalysisStatus, JobDescriptionSource, ResumeSource } from "@/types";

interface ReviewStore {
  jobDescription: string;
  jobDescriptionSource: JobDescriptionSource | null;
  resumeText: string;
  resumeSource: ResumeSource;
  fileName: string | null;

  analysisResult: AnalysisResult | null;
  analysisStatus: AnalysisStatus;
  analysisProgress: string[];
  error: string | null;

  setJobDescription: (text: string, source?: JobDescriptionSource) => void;
  setResumeText: (text: string, source: ResumeSource, fileName?: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setAnalysisStatus: (status: AnalysisStatus) => void;
  addProgress: (message: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  jobDescription: "",
  jobDescriptionSource: null,
  resumeText: "",
  resumeSource: "text",
  fileName: null,

  analysisResult: null,
  analysisStatus: "idle",
  analysisProgress: [],
  error: null,

  setJobDescription: (text, source) =>
    set({ jobDescription: text, jobDescriptionSource: source ?? "text" }),

  setResumeText: (text, source, fileName) =>
    set({ resumeText: text, resumeSource: source, fileName: fileName ?? null }),

  setAnalysisResult: (result) =>
    set({ analysisResult: result, analysisStatus: "complete" }),

  setAnalysisStatus: (status) => set({ analysisStatus: status }),

  addProgress: (message) =>
    set((state) => ({ analysisProgress: [...state.analysisProgress, message] })),

  setError: (error) =>
    set((state) => ({
      error,
      analysisStatus: error
        ? "error"
        : state.analysisStatus === "error"
        ? "idle"
        : state.analysisStatus,
    })),

  reset: () =>
    set({
      jobDescription: "",
      jobDescriptionSource: null,
      resumeText: "",
      resumeSource: "text",
      fileName: null,
      analysisResult: null,
      analysisStatus: "idle",
      analysisProgress: [],
      error: null,
    }),
}));
