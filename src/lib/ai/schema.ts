import { z } from "zod/v4";

const categoryScoreSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
});

const feedbackItemSchema = z.object({
  severity: z.enum(["critical", "major", "minor", "suggestion"]),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  fix: z.string(),
});

const requirementMatchSchema = z.object({
  requirement: z.string(),
  status: z.enum(["matched", "partial", "missing"]),
  evidence: z.string().optional(),
});

export const analysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categories: z.object({
    atsCompatibility: categoryScoreSchema,
    recruiterReadiness: categoryScoreSchema,
    requirementMatch: categoryScoreSchema,
    contentQuality: categoryScoreSchema,
  }),
  verdict: z.object({
    decision: z.enum(["APPLY", "APPLY_WITH_IMPROVEMENTS", "DO_NOT_APPLY"]),
    summary: z.string(),
  }),
  feedback: z.array(feedbackItemSchema),
  requirementMatch: z.array(requirementMatchSchema),
});

export type AnalysisResultSchema = z.infer<typeof analysisResultSchema>;
