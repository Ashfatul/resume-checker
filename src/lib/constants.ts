export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_TEXT_LENGTH = 10_000;
export const MAX_REQUEST_SIZE = 500 * 1024; // 500 KB
export const ANALYSIS_TIMEOUT = 180_000; // 180 seconds (3 minutes)
export const URL_FETCH_TIMEOUT = 10_000; // 10 seconds
export const URL_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
export const JOB_OCR_TIMEOUT = 30_000; // 30 seconds

export const SUPPORTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
} as const;

export const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc"];

export const SUPPORTED_JOB_IMAGE_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
} as const;

export const SUPPORTED_JOB_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export const DEFAULT_MODELS: Record<string, string> = {
  gemini: "gemini-2.0-flash",
  openai: "gpt-4o-mini",
  ollama: "llama3.2",
};

export const PROVIDER_LABELS: Record<string, string> = {
  gemini: "Google Gemini",
  openai: "OpenAI",
  ollama: "Ollama (Local)",
};

export const SEVERITY_CONFIG = {
  critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", icon: "🔴", label: "Critical" },
  major: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", icon: "🟠", label: "Major" },
  minor: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", icon: "🟡", label: "Minor" },
  suggestion: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", icon: "🔵", label: "Suggestion" },
} as const;

export const VERDICT_CONFIG = {
  APPLY: { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-300 dark:border-green-800", icon: "🟢", label: "Apply" },
  APPLY_WITH_IMPROVEMENTS: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-300 dark:border-yellow-800", icon: "🟡", label: "Apply with Improvements" },
  DO_NOT_APPLY: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-300 dark:border-red-800", icon: "🔴", label: "Do Not Apply" },
} as const;

export const LOADING_TIPS = [
  "75% of resumes are rejected by ATS before a human ever sees them.",
  "Recruiters spend an average of 6-7 seconds on an initial resume scan.",
  "Tailoring your resume to each job description can increase callbacks by 50%.",
  "Quantified achievements are 40% more likely to catch a recruiter's attention.",
  "Using standard section headings helps ATS parse your resume correctly.",
  "A professional summary is more effective than an objective statement for experienced candidates.",
  "Including relevant keywords from the job posting improves ATS matching significantly.",
  "Gaps in employment are less concerning when you can show skill development during that time.",
];

export const ANALYSIS_STEPS = [
  "Parsing documents",
  "Checking ATS compatibility",
  "Evaluating recruiter perspective",
  "Matching requirements",
  "Generating verdict",
] as const;
