export const SYSTEM_PROMPT = `You are an expert resume analyst with 15+ years of experience in recruiting, HR, and Applicant Tracking Systems (ATS). You analyze resumes against job descriptions with the precision of an ATS scanner and the insight of a senior recruiter.

You MUST respond with valid JSON matching the provided schema. Be specific, actionable, and honest in your feedback.`;

export function buildAnalysisPrompt(jobDescription: string, resumeText: string, schemaDescription: string): string {
  return `Analyze the following resume against the job description.

## Job Description:
${jobDescription}

## Resume:
${resumeText}

## Analysis Instructions:

Evaluate the resume across these 4 categories. For each, provide a score (0-100) and specific feedback:

### 1. ATS Compatibility (score: 0-100)
- Check for ATS-unfriendly formatting clues in the text
- Look for proper section headings (Experience, Education, Skills)
- Check for keyword optimization against the job description
- Flag any elements that ATS systems commonly fail to parse

### 2. Recruiter Readiness — Strict Mode (score: 0-100)
- Evaluate from a time-pressed recruiter's perspective (6-second scan)
- Is the most important information immediately visible?
- Are achievements quantified with metrics?
- Is the resume concise and well-structured?
- Does the professional summary/objective align with the role?

### 3. Requirement Match (score: 0-100)
- List EVERY requirement from the job description
- For each: mark as "matched", "partial", or "missing"
- Provide evidence from the resume for matches
- Calculate match percentage

### 4. Content Quality (score: 0-100)
- Check for inconsistencies (date gaps, title progression)
- Identify vague or weak language
- Evaluate action verbs and impact statements
- Check for typos or grammatical issues visible in text
- Assess overall coherence and narrative

### 5. Verdict
Based on all scores, provide:
- Overall score (weighted average)
- Decision: APPLY / APPLY_WITH_IMPROVEMENTS / DO_NOT_APPLY
- Summary explaining the verdict

### 6. Feedback Items
For each issue found, provide:
- severity: "critical" | "major" | "minor" | "suggestion"
- category: which of the 4 categories it belongs to
- title: short description
- description: detailed explanation
- fix: actionable suggestion to resolve it

Respond ONLY with valid JSON matching this schema:
${schemaDescription}`;
}
