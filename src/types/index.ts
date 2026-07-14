export type AIProvider = "gemini" | "openai" | "ollama";

export type VerdictDecision = "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "DO_NOT_APPLY";

export type FeedbackSeverity = "critical" | "major" | "minor" | "suggestion";

export type RequirementStatus = "matched" | "partial" | "missing";

export type ResumeSource = "text" | "file" | "url";

export type AnalysisStatus = "idle" | "parsing" | "analyzing" | "complete" | "error";

export interface CategoryScore {
  score: number;
  summary: string;
}

export interface AnalysisCategories {
  atsCompatibility: CategoryScore;
  recruiterReadiness: CategoryScore;
  requirementMatch: CategoryScore;
  contentQuality: CategoryScore;
}

export interface Verdict {
  decision: VerdictDecision;
  summary: string;
}

export interface FeedbackItem {
  severity: FeedbackSeverity;
  category: string;
  title: string;
  description: string;
  fix: string;
}

export interface RequirementMatchItem {
  requirement: string;
  status: RequirementStatus;
  evidence?: string;
}

export interface AnalysisMetadata {
  provider: string;
  model: string;
  timestamp: string;
}

export interface AnalysisResult {
  overallScore: number;
  categories: AnalysisCategories;
  verdict: Verdict;
  feedback: FeedbackItem[];
  requirementMatch: RequirementMatchItem[];
  metadata: AnalysisMetadata;
}

export interface SettingsState {
  provider: AIProvider | null;
  model: string | null;
  ollamaUrl: string;
  hasConsented: boolean;
  isConfigured: boolean;

  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setOllamaUrl: (url: string) => void;
  setConsented: (consented: boolean) => void;
  saveApiKey: (key: string) => Promise<void>;
  getApiKey: () => Promise<string | null>;
  clearSettings: () => void;
}

export interface ReviewState {
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
