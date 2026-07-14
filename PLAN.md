# ResumeChecker - In-Depth Implementation Plan

> An open-source, self-hostable, zero-knowledge AI-powered resume reviewer.
> No data leaves the user's browser except to the AI provider they configure.

---

## 1. Project Overview

**What it does:** Accepts a job description + a resume (as text, PDF, DOC, or URL), sends them through the user's own AI provider, and returns a detailed ATS & recruiter-perspective analysis with scores, issue tags, and an apply/don't-apply verdict.

**Core principles:**
- Zero-knowledge: we never see, store, or transmit user data to our servers
- API keys encrypted at rest in localStorage
- Works offline with Ollama; works in the cloud with Gemini/OpenAI
- Single `docker run` or `npm start` to self-host
- Clean, accessible, mobile-friendly UI

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSR landing page for SEO, API routes for AI proxy, single deployable |
| Language | **TypeScript** | Type safety across AI response schemas |
| Styling | **Tailwind CSS 4 + shadcn/ui** | Rapid, consistent, accessible component library |
| State | **Zustand** | Lightweight, no boilerplate, persists to localStorage easily |
| PDF parsing | **pdf-parse** (server-side) | Extracts text from uploaded PDFs in API routes |
| DOC/DOCX parsing | **mammoth** (server-side) | Converts .docx to text reliably |
| URL fetching | **cheerio + node-fetch** (server-side) | Scrapes and cleans webpage content |
| Encryption | **Web Crypto API (AES-GCM)** | Browser-native, no dependencies, strong encryption |
| AI SDKs | **Vercel AI SDK (`ai`)** | Unified streaming interface for OpenAI, Google Generative AI, Ollama |
| Icons | **Lucide React** | Consistent, tree-shakeable icon set (ships with shadcn) |
| Animations | **Framer Motion** | Smooth page transitions, loading states, result reveals |
| PDF export | **react-to-print** + **@react-pdf/renderer** | Print/export the final report |
| Linting | **ESLint + Prettier** | Code quality |
| Package manager | **pnpm** | Fast, disk-efficient |

---

## 3. Project Structure

```
ResumeChecker/
├── public/
│   ├── og-image.png              # Social preview image
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (fonts, theme provider, toaster)
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Tailwind imports + custom theme tokens
│   │   ├── settings/
│   │   │   └── page.tsx          # API key configuration page
│   │   ├── review/
│   │   │   └── page.tsx          # Upload job desc + resume page
│   │   └── results/
│   │       └── page.tsx          # Analysis results page
│   │
│   ├── api/                      # Next.js API routes (run server-side)
│   │   ├── analyze/
│   │   │   └── route.ts          # Main AI analysis endpoint (streams response)
│   │   ├── parse/
│   │   │   └── route.ts          # File parsing endpoint (PDF/DOC → text)
│   │   └── fetch-url/
│   │       └── route.ts          # URL content extraction endpoint
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives (button, card, input, etc.)
│   │   ├── landing/
│   │   │   ├── hero.tsx          # Hero section with CTA
│   │   │   ├── features.tsx      # Feature cards (ATS, recruiter, etc.)
│   │   │   ├── how-it-works.tsx  # Step-by-step guide
│   │   │   └── privacy-banner.tsx # Zero-knowledge trust badge
│   │   ├── settings/
│   │   │   ├── provider-selector.tsx   # Gemini / OpenAI / Ollama tabs
│   │   │   ├── api-key-form.tsx        # Key input + validation + save
│   │   │   ├── ollama-config.tsx       # Ollama URL + model selector
│   │   │   └── privacy-consent.tsx     # localStorage consent modal
│   │   ├── review/
│   │   │   ├── job-input.tsx           # Job description input (text/file)
│   │   │   ├── resume-input.tsx        # Resume input (text/file/URL)
│   │   │   ├── file-dropzone.tsx       # Drag & drop file upload zone
│   │   │   └── submit-button.tsx       # Submit with validation
│   │   ├── results/
│   │   │   ├── score-overview.tsx      # Overall score ring/gauge
│   │   │   ├── category-scores.tsx     # ATS, Recruiter, Match scores
│   │   │   ├── feedback-list.tsx       # Tagged feedback items
│   │   │   ├── feedback-item.tsx       # Single feedback card with severity tag
│   │   │   ├── verdict-card.tsx        # Apply / Don't Apply verdict
│   │   │   ├── print-report.tsx        # Print button + formatted layout
│   │   │   └── ai-disclaimer.tsx       # "AI-generated" warning
│   │   ├── shared/
│   │   │   ├── header.tsx              # Minimal top nav
│   │   │   ├── footer.tsx              # Links, GitHub, version
│   │   │   ├── theme-toggle.tsx        # Dark/light mode
│   │   │   ├── loading-animation.tsx   # Analysis-in-progress animation
│   │   │   └── stepper.tsx             # Progress indicator (Settings → Review → Results)
│   │   └── providers.tsx               # Theme + Zustand + Toaster wrapper
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── providers.ts            # AI provider factory (OpenAI/Gemini/Ollama)
│   │   │   ├── prompts.ts              # System + analysis prompts
│   │   │   └── schema.ts              # Zod schemas for AI response validation
│   │   ├── crypto.ts                   # AES-GCM encrypt/decrypt for API keys
│   │   ├── parsers/
│   │   │   ├── pdf.ts                  # PDF text extraction
│   │   │   ├── docx.ts                 # DOCX text extraction
│   │   │   └── url.ts                  # URL content scraping
│   │   ├── validators.ts              # Input validation (file size, type, key format)
│   │   └── constants.ts               # Max file sizes, supported formats, etc.
│   │
│   ├── store/
│   │   ├── settings-store.ts          # API key + provider config (encrypted persistence)
│   │   └── review-store.ts            # Current review session state
│   │
│   ├── hooks/
│   │   ├── use-settings.ts            # Settings access + first-time detection
│   │   └── use-analysis.ts            # Analysis submission + streaming state
│   │
│   └── types/
│       └── index.ts                   # Shared TypeScript types/interfaces
│
├── .env.example                  # Template (NEXT_PUBLIC_APP_URL only — no secrets)
├── Dockerfile                    # Multi-stage production build
├── docker-compose.yml            # One-command self-hosting
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── LICENSE                       # MIT
├── PLAN.md                       # This file
└── README.md                     # Setup, usage, self-hosting guide
```

---

## 4. Page-by-Page Design

### 4.1 Landing Page (`/`)

**Purpose:** Explain the tool, build trust, guide users to start.

**Layout:**
```
┌──────────────────────────────────────────────┐
│  [Logo] ResumeChecker          [Theme] [GitHub]│
├──────────────────────────────────────────────┤
│                                              │
│     Check Your Resume Like a Recruiter       │
│     AI-powered ATS & recruiter analysis      │
│     100% private — your data never leaves    │
│                                              │
│         [ Get Started → ]                    │
│                                              │
├──────────────────────────────────────────────┤
│  How It Works                                │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ 1.  │  │ 2.  │  │ 3.  │  │ 4.  │        │
│  │Setup│  │ Job │  │Resu-│  │ Get │        │
│  │ Key │  │ Desc│  │ me  │  │Score│        │
│  └─────┘  └─────┘  └─────┘  └─────┘        │
├──────────────────────────────────────────────┤
│  What You Get                                │
│  ✓ ATS compatibility score                   │
│  ✓ Recruiter-eye review                      │
│  ✓ Requirement match analysis                │
│  ✓ Issue detection with severity tags        │
│  ✓ Apply / Don't Apply verdict               │
│  ✓ Printable report                          │
├──────────────────────────────────────────────┤
│  Privacy & Security                          │
│  • Zero-knowledge: we store nothing          │
│  • API keys encrypted in your browser        │
│  • Open source: audit the code yourself      │
│  • Self-host on your own infrastructure      │
├──────────────────────────────────────────────┤
│  Supported Providers                         │
│  [Gemini]  [OpenAI]  [Ollama (Local)]        │
├──────────────────────────────────────────────┤
│  Footer: MIT License | GitHub | Version      │
└──────────────────────────────────────────────┘
```

**Behavior:**
- "Get Started" checks if API key exists in localStorage
  - If yes → navigate to `/review`
  - If no → navigate to `/settings`
- Smooth scroll between sections
- Responsive: stacks vertically on mobile

---

### 4.2 Settings Page (`/settings`)

**Purpose:** Configure AI provider and API key.

**Layout:**
```
┌──────────────────────────────────────────────┐
│  ← Back    Settings              Step 1 of 3 │
├──────────────────────────────────────────────┤
│                                              │
│  Choose Your AI Provider                     │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Gemini  │ │  OpenAI  │ │  Ollama  │     │
│  │  (Free   │ │  (GPT-4) │ │  (Local) │     │
│  │   tier)  │ │          │ │          │     │
│  └──────────┘ └──────────┘ └──────────┘     │
│                                              │
│  ┌─── Selected: Gemini ───────────────────┐  │
│  │                                        │  │
│  │  API Key:  [••••••••••••••••] [👁 Show] │  │
│  │                                        │  │
│  │  Model: [gemini-2.0-flash ▾]           │  │
│  │                                        │  │
│  │  [ Validate Key ]  ✓ Key is valid      │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─── Privacy Notice ────────────────────┐   │
│  │ ⓘ Your API key is encrypted and       │   │
│  │   stored ONLY in this browser's       │   │
│  │   localStorage. We cannot access it.  │   │
│  │                                       │   │
│  │   If you clear browser data, you will │   │
│  │   need to enter it again.             │   │
│  │                                       │   │
│  │   [✓] I understand and consent        │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  [ Save & Continue → ]                       │
│                                              │
└──────────────────────────────────────────────┘
```

**Behavior:**
- Provider tabs switch between Gemini, OpenAI, Ollama
- Ollama tab shows URL input (default: `http://localhost:11434`) + model dropdown (fetched from Ollama API)
- "Validate Key" makes a lightweight API call to verify the key works
- Consent checkbox required before saving
- Key encrypted with AES-GCM before writing to localStorage
- "Save & Continue" → `/review`
- Users can return here anytime to change provider/key
- Show helper links: "Get a Gemini API key →", "Get an OpenAI key →"

**Ollama-specific:**
```
┌─── Selected: Ollama ──────────────────────┐
│                                           │
│  Server URL: [http://localhost:11434    ]  │
│                                           │
│  [ Check Connection ] ✓ Connected         │
│                                           │
│  Model: [llama3.2 ▾]                      │
│         (fetched from your Ollama server) │
│                                           │
│  ⓘ Ollama runs on your machine.           │
│    No API key needed. No data leaves      │
│    your computer at all.                  │
│                                           │
└───────────────────────────────────────────┘
```

---

### 4.3 Review Page (`/review`)

**Purpose:** Collect job description and resume for analysis.

**Guard:** If no API key configured, redirect to `/settings` with a toast message.

**Layout:**
```
┌──────────────────────────────────────────────┐
│  ← Home    Review               Step 2 of 3  │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─── Job Description ───────────────────┐   │
│  │                                       │   │
│  │  How would you like to provide it?    │   │
│  │  (Text) (Upload PDF)                  │   │
│  │                                       │   │
│  │  ┌─────────────────────────────────┐  │   │
│  │  │                                 │  │   │
│  │  │   Paste job description here... │  │   │
│  │  │                                 │  │   │
│  │  │                                 │  │   │
│  │  └─────────────────────────────────┘  │   │
│  │                              0/10000  │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── Your Resume ───────────────────────┐   │
│  │                                       │   │
│  │  How would you like to provide it?    │   │
│  │  (Text) (Upload File) (From URL)      │   │
│  │                                       │   │
│  │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │   │
│  │  │                                │  │   │
│  │  │   📄 Drag & drop your resume   │  │   │
│  │  │      PDF, DOC, DOCX            │  │   │
│  │  │      (max 5 MB)                │  │   │
│  │  │                                │  │   │
│  │  │   or [Browse Files]            │  │   │
│  │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │   │
│  │                                       │   │
│  │  ✓ resume_john_doe.pdf uploaded       │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── Provider ──────────────────────────┐   │
│  │  Using: Gemini (gemini-2.0-flash)     │   │
│  │  [Change in Settings]                 │   │
│  └───────────────────────────────────────┘   │
│                                              │
│         [ Analyze My Resume → ]              │
│                                              │
└──────────────────────────────────────────────┘
```

**Behavior:**
- Job description: text area or PDF upload (parsed server-side)
- Resume: text area, file upload (PDF/DOC/DOCX), or URL input
- URL option: enters a URL → server fetches and extracts text
- File uploads handled via API route (`/api/parse`) — never sent to AI directly as binary
- Character/file size limits enforced with clear error messages
- Submit disabled until both inputs provided
- Shows current provider at bottom with link to change
- On submit → calls `/api/analyze` → navigates to `/results`

---

### 4.4 Results Page (`/results`)

**Purpose:** Display comprehensive analysis with scores, feedback, and verdict.

**Loading State:**
```
┌──────────────────────────────────────────────┐
│                                              │
│         ┌──────────────────────┐             │
│         │                      │             │
│         │   [Animated brain    │             │
│         │    or document icon  │             │
│         │    with scanning     │             │
│         │    effect]           │             │
│         │                      │             │
│         └──────────────────────┘             │
│                                              │
│      Analyzing your resume...                │
│                                              │
│      ┌────────────────────────────┐          │
│      │ ✓ Parsing documents        │          │
│      │ ✓ Checking ATS compat.     │          │
│      │ ◌ Recruiter perspective... │          │
│      │ ○ Matching requirements    │          │
│      │ ○ Generating verdict       │          │
│      └────────────────────────────┘          │
│                                              │
│      💡 Did you know? 75% of resumes are     │
│         rejected by ATS before a human       │
│         ever sees them.                      │
│                                              │
└──────────────────────────────────────────────┘
```

**Results Layout:**
```
┌──────────────────────────────────────────────┐
│  ← New Review    Results        [🖨 Print]   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─── Overall Score ─────────────────────┐   │
│  │         ┌─────┐                       │   │
│  │         │ 72  │  / 100                │   │
│  │         │     │  Good — with fixes    │   │
│  │         └─────┘                       │   │
│  │  (animated circular progress gauge)   │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── Category Scores ───────────────────┐   │
│  │                                       │   │
│  │  ATS Compatibility     ████████░░ 78  │   │
│  │  Recruiter Readiness   ███████░░░ 70  │   │
│  │  Requirement Match     ██████░░░░ 65  │   │
│  │  Content Quality       ████████░░ 75  │   │
│  │                                       │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── Verdict ───────────────────────────┐   │
│  │                                       │   │
│  │  🟡 APPLY WITH IMPROVEMENTS           │   │
│  │                                       │   │
│  │  Your resume is a reasonable match    │   │
│  │  but has 3 critical issues that       │   │
│  │  should be fixed before applying.     │   │
│  │                                       │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── Detailed Feedback ─────────────────┐   │
│  │                                       │   │
│  │  Filter: [All] [Critical] [Major]     │   │
│  │          [Minor] [Suggestion]         │   │
│  │                                       │   │
│  │  ┌─ 🔴 Critical ─────────────────┐   │   │
│  │  │ Missing key skill: "Kubernetes"│   │   │
│  │  │ The job requires Kubernetes    │   │   │
│  │  │ experience but your resume     │   │   │
│  │  │ doesn't mention it.            │   │   │
│  │  │ Category: Requirement Match    │   │   │
│  │  │ 💡 Fix: Add Kubernetes to your │   │   │
│  │  │ skills if you have experience  │   │   │
│  │  └────────────────────────────────┘   │   │
│  │                                       │   │
│  │  ┌─ 🟠 Major ────────────────────┐   │   │
│  │  │ Resume exceeds 2 pages         │   │   │
│  │  │ Most ATS systems and recruiters│   │   │
│  │  │ prefer 1-2 page resumes.       │   │   │
│  │  │ Category: ATS Compatibility    │   │   │
│  │  │ 💡 Fix: Consolidate older roles│   │   │
│  │  └────────────────────────────────┘   │   │
│  │                                       │   │
│  │  ┌─ 🟢 Suggestion ───────────────┐   │   │
│  │  │ Consider adding metrics to     │   │   │
│  │  │ your achievement bullets.      │   │   │
│  │  │ Category: Content Quality      │   │   │
│  │  │ 💡 Example: "Reduced load time │   │   │
│  │  │ by 40%" instead of "Improved   │   │   │
│  │  │ performance"                   │   │   │
│  │  └────────────────────────────────┘   │   │
│  │                                       │   │
│  │  ... more feedback items              │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── Matched Requirements ──────────────┐   │
│  │  ✓ React.js         ✓ TypeScript      │   │
│  │  ✓ Node.js          ✗ Kubernetes      │   │
│  │  ✓ CI/CD            ~ Docker (weak)   │   │
│  │  ✓ = found, ✗ = missing, ~ = partial  │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌─── AI Disclaimer ────────────────────┐    │
│  │ ⚠ This report was generated by AI.    │    │
│  │ AI can make mistakes. Use this as     │    │
│  │ guidance, not as a definitive         │    │
│  │ assessment. Always apply your own     │    │
│  │ judgment.                             │    │
│  │                                       │    │
│  │ Provider: Gemini (gemini-2.0-flash)   │    │
│  │ Generated: 2026-07-14 at 14:30 UTC   │    │
│  └───────────────────────────────────────┘   │
│                                              │
│  [ ← Analyze Another ]    [ 🖨 Print Report ]│
│                                              │
└──────────────────────────────────────────────┘
```

---

## 5. API Routes Design

### 5.1 `POST /api/parse`

**Purpose:** Extract text from uploaded files (PDF, DOC, DOCX).

```
Request:  FormData { file: File }
Response: { text: string, pageCount?: number, wordCount: number }
```

**Logic:**
1. Validate file type (pdf, doc, docx) and size (max 5 MB)
2. Use `pdf-parse` for PDFs, `mammoth` for DOCX
3. Return extracted plain text
4. No file is stored — processed in memory, discarded after response

### 5.2 `POST /api/fetch-url`

**Purpose:** Fetch and extract text content from a URL (for online resumes/portfolios).

```
Request:  { url: string }
Response: { text: string, title: string, wordCount: number }
```

**Logic:**
1. Validate URL format
2. Fetch with timeout (10s) and size limit (2 MB)
3. Parse HTML with `cheerio`, extract meaningful text content
4. Strip nav, footer, scripts, styles — keep main content
5. Return cleaned text

### 5.3 `POST /api/analyze`

**Purpose:** Send job description + resume text to the AI provider for analysis.

```
Request: {
  jobDescription: string,
  resumeText: string,
  provider: "gemini" | "openai" | "ollama",
  apiKey: string,         // decrypted on client, sent over HTTPS
  model: string,
  ollamaUrl?: string      // only for Ollama
}

Response: ReadableStream (Server-Sent Events for progress updates)

Final payload (streamed as JSON):
{
  overallScore: number,        // 0-100
  categories: {
    atsCompatibility: { score: number, summary: string },
    recruiterReadiness: { score: number, summary: string },
    requirementMatch: { score: number, summary: string },
    contentQuality: { score: number, summary: string }
  },
  verdict: {
    decision: "APPLY" | "APPLY_WITH_IMPROVEMENTS" | "DO_NOT_APPLY",
    summary: string
  },
  feedback: [{
    severity: "critical" | "major" | "minor" | "suggestion",
    category: string,
    title: string,
    description: string,
    fix: string
  }],
  requirementMatch: [{
    requirement: string,
    status: "matched" | "partial" | "missing",
    evidence?: string
  }],
  metadata: {
    provider: string,
    model: string,
    timestamp: string
  }
}
```

**Logic:**
1. Validate inputs (non-empty, within size limits)
2. API key is received from the client per-request (not stored server-side)
3. Build the analysis prompt (see Section 6)
4. Stream the response to client via SSE for real-time progress
5. Parse and validate AI response against Zod schema
6. Return structured result

**Security:**
- API key never logged, never stored, never sent anywhere except the chosen AI provider
- Rate limiting via simple in-memory counter (prevents abuse on shared deployments)
- Request size capped at 500 KB total

---

## 6. AI Prompt Engineering

### 6.1 System Prompt

```
You are an expert resume analyst with 15+ years of experience in
recruiting, HR, and Applicant Tracking Systems (ATS). You analyze
resumes against job descriptions with the precision of an ATS scanner
and the insight of a senior recruiter.

You MUST respond with valid JSON matching the provided schema.
Be specific, actionable, and honest in your feedback.
```

### 6.2 Analysis Prompt Structure

The analysis will be done in a single comprehensive prompt that instructs the AI to evaluate across all dimensions:

```
Analyze the following resume against the job description.

## Job Description:
{jobDescription}

## Resume:
{resumeText}

## Analysis Instructions:

Evaluate the resume across these 4 categories. For each, provide a
score (0-100) and specific feedback:

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
{schema}
```

### 6.3 Model Recommendations

| Provider | Recommended Model | Why |
|---|---|---|
| Gemini | `gemini-2.0-flash` | Fast, capable, generous free tier |
| OpenAI | `gpt-4o-mini` | Good balance of quality and cost |
| Ollama | `llama3.2` / `mistral` | Best open-source options for structured analysis |

These are defaults; users can select any model available on their provider.

---

## 7. Security Design

### 7.1 API Key Encryption (Client-Side)

```
Encryption: AES-256-GCM via Web Crypto API
Key derivation: PBKDF2 from a device-specific fingerprint + static salt
Storage: encrypted blob + IV in localStorage
```

**Flow:**
1. User enters API key
2. Generate a random IV (12 bytes)
3. Derive encryption key from browser fingerprint via PBKDF2
4. Encrypt API key with AES-GCM
5. Store `{ iv, ciphertext, salt }` in localStorage
6. On retrieval: derive key again, decrypt, return plaintext
7. Plaintext key is held in memory only during the session

**Why this approach:**
- Keys are encrypted at rest — a localStorage dump doesn't expose them
- No master password required (fingerprint-based), keeping UX simple
- AES-GCM provides both confidentiality and integrity
- Clearing browser data destroys the key (by design)

### 7.2 API Route Security

- API keys flow: `localStorage (encrypted) → client memory (decrypted) → HTTPS → API route → AI provider`
- API routes never log request bodies
- No cookies, no sessions, no server-side state
- CORS locked to same-origin
- Input sanitization on all routes
- File uploads validated by magic bytes, not just extension

### 7.3 Content Security

- CSP headers via Next.js middleware
- No inline scripts
- No external analytics or tracking (zero-knowledge promise)
- Subresource Integrity for CDN assets (if any)

---

## 8. State Management

### 8.1 Settings Store (Zustand + Encrypted localStorage)

```typescript
interface SettingsState {
  provider: "gemini" | "openai" | "ollama" | null;
  model: string | null;
  ollamaUrl: string;           // default: http://localhost:11434
  hasConsented: boolean;
  isConfigured: boolean;       // derived: provider + key/connection exists

  // Actions
  setProvider: (provider: string) => void;
  saveApiKey: (key: string) => Promise<void>;    // encrypts + stores
  getApiKey: () => Promise<string | null>;       // decrypts + returns
  clearSettings: () => void;
}
```

### 8.2 Review Store (Zustand, session-only — not persisted)

```typescript
interface ReviewState {
  jobDescription: string | null;
  resumeText: string | null;
  resumeSource: "text" | "file" | "url";
  fileName: string | null;

  analysisResult: AnalysisResult | null;
  analysisStatus: "idle" | "parsing" | "analyzing" | "complete" | "error";
  analysisProgress: string[];    // progress messages for loading UI
  error: string | null;

  // Actions
  setJobDescription: (text: string) => void;
  setResumeText: (text: string, source: string, fileName?: string) => void;
  startAnalysis: () => Promise<void>;
  reset: () => void;
}
```

---

## 9. UI/UX Details

### 9.1 Theme

- **Light mode default**, dark mode toggle
- Color palette: clean blues + neutral grays
- Severity colors: Red (critical), Orange (major), Yellow (minor), Blue (suggestion)
- Verdict colors: Green (Apply), Yellow (Apply with improvements), Red (Don't apply)
- shadcn/ui provides accessible, consistent components out of the box

### 9.2 Responsive Breakpoints

- Mobile-first design
- `sm` (640px): Stack to single column
- `md` (768px): Side-by-side where appropriate
- `lg` (1024px): Full layout with whitespace
- Max content width: 800px (readability)

### 9.3 Animations (Framer Motion)

- Page transitions: subtle slide + fade
- Score reveals: count-up animation on numbers, progress bar fill
- Feedback items: staggered entrance
- Loading: multi-step progress with rotating tips/facts
- File upload: drag hover glow effect

### 9.4 Loading Experience

While waiting for AI analysis (can take 10-30 seconds):
1. Animated progress checklist (parsing → ATS check → recruiter check → matching → verdict)
2. Rotating "Did you know?" resume tips
3. Subtle document scanning animation
4. Progress is real when possible (parsing step completes first), estimated for AI steps

### 9.5 Accessibility

- All interactive elements keyboard-navigable
- ARIA labels on custom components
- Color is never the only indicator (icons + text accompany colors)
- Focus management on page transitions
- Screen reader announcements for async operations
- Minimum contrast ratios met (WCAG AA)

### 9.6 Error Handling UX

| Error | User sees |
|---|---|
| Invalid API key | "Your API key was rejected by {provider}. Please check it in Settings." + link |
| AI timeout | "The AI took too long to respond. This can happen with large resumes. Try again?" + retry button |
| File too large | "File must be under 5 MB. Your file is {size}." |
| Unsupported format | "We support PDF, DOC, and DOCX files. You uploaded a {ext} file." |
| URL unreachable | "Couldn't reach that URL. Make sure it's publicly accessible." |
| Ollama not running | "Can't connect to Ollama at {url}. Is it running?" + setup guide link |
| Rate limited | "Too many requests. Please wait a moment and try again." |
| AI response invalid | "The AI returned an unexpected response. Trying again..." + auto-retry once |

---

## 10. Print / Export

### 10.1 Print Report

- `react-to-print` triggers browser print dialog
- Print-specific CSS: hide nav, buttons, animations
- Clean black & white friendly layout
- Includes:
  - Overall score and category breakdown
  - All feedback items with severity and fix suggestions
  - Requirement match table
  - Verdict
  - AI disclaimer with provider, model, and timestamp
  - "Generated by ResumeChecker (open-source) — AI-generated report"

### 10.2 Print Layout

```
┌──────────────────────────────────────────────┐
│  ResumeChecker — Resume Analysis Report      │
│  Generated: 2026-07-14 | Provider: Gemini    │
├──────────────────────────────────────────────┤
│                                              │
│  Overall Score: 72/100 — Good, with fixes    │
│                                              │
│  Category Breakdown:                         │
│  • ATS Compatibility:    78/100              │
│  • Recruiter Readiness:  70/100              │
│  • Requirement Match:    65/100              │
│  • Content Quality:      75/100              │
│                                              │
│  Verdict: APPLY WITH IMPROVEMENTS            │
│  Your resume is a reasonable match but has   │
│  3 critical issues to fix before applying.   │
│                                              │
├──────────────────────────────────────────────┤
│  Detailed Feedback:                          │
│  ... (all items listed)                      │
├──────────────────────────────────────────────┤
│  Requirement Match:                          │
│  ... (table)                                 │
├──────────────────────────────────────────────┤
│  ⚠ DISCLAIMER: This report was generated    │
│  by AI and may contain errors. Use as        │
│  guidance only. AI can make mistakes.        │
│                                              │
│  ResumeChecker is open-source software.      │
│  github.com/[user]/ResumeChecker             │
└──────────────────────────────────────────────┘
```

---

## 11. Self-Hosting & Deployment

### 11.1 Docker

```dockerfile
# Multi-stage build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 11.2 docker-compose.yml

```yaml
services:
  resumechecker:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### 11.3 One-Command Deploy

```bash
# With Docker
docker compose up -d

# Without Docker
pnpm install && pnpm build && pnpm start

# Development
pnpm install && pnpm dev
```

### 11.4 Environment Variables

```env
# .env.example
# No secrets needed! API keys are stored client-side.
NEXT_PUBLIC_APP_URL=http://localhost:3000    # For OG meta tags
```

---

## 12. Implementation Phases

### Phase 1: Foundation (Steps 1-4)

| # | Task | Files |
|---|---|---|
| 1 | Initialize Next.js 15 project with TypeScript, Tailwind, pnpm | `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` |
| 2 | Install and configure shadcn/ui | `components/ui/*`, `lib/utils.ts`, `globals.css` |
| 3 | Set up project structure (folders, layout, theme provider) | `app/layout.tsx`, `components/providers.tsx` |
| 4 | Implement shared components (header, footer, stepper, theme toggle) | `components/shared/*` |

### Phase 2: Settings & Encryption (Steps 5-8)

| # | Task | Files |
|---|---|---|
| 5 | Build AES-GCM encryption/decryption utility | `lib/crypto.ts` |
| 6 | Create Zustand settings store with encrypted persistence | `store/settings-store.ts` |
| 7 | Build settings page UI (provider tabs, key input, validation) | `app/settings/page.tsx`, `components/settings/*` |
| 8 | Implement API key validation (lightweight calls to each provider) | `lib/ai/providers.ts` |

### Phase 3: Input & Parsing (Steps 9-13)

| # | Task | Files |
|---|---|---|
| 9 | Build file parsing API route (PDF + DOCX) | `api/parse/route.ts`, `lib/parsers/*` |
| 10 | Build URL fetching API route | `api/fetch-url/route.ts`, `lib/parsers/url.ts` |
| 11 | Create review page UI with job description input | `app/review/page.tsx`, `components/review/job-input.tsx` |
| 12 | Create resume input with text/file/URL modes | `components/review/resume-input.tsx`, `components/review/file-dropzone.tsx` |
| 13 | Create Zustand review store + route guards | `store/review-store.ts`, `hooks/use-settings.ts` |

### Phase 4: AI Analysis (Steps 14-17)

| # | Task | Files |
|---|---|---|
| 14 | Design and test analysis prompts | `lib/ai/prompts.ts` |
| 15 | Build AI provider abstraction (OpenAI, Gemini, Ollama) | `lib/ai/providers.ts` |
| 16 | Create analysis API route with streaming | `api/analyze/route.ts` |
| 17 | Define and validate AI response schema with Zod | `lib/ai/schema.ts` |

### Phase 5: Results & Polish (Steps 18-23)

| # | Task | Files |
|---|---|---|
| 18 | Build loading animation with progress steps | `components/shared/loading-animation.tsx` |
| 19 | Build results page: score overview + category breakdown | `app/results/page.tsx`, `components/results/score-overview.tsx`, `components/results/category-scores.tsx` |
| 20 | Build feedback list with severity filtering | `components/results/feedback-list.tsx`, `components/results/feedback-item.tsx` |
| 21 | Build verdict card + requirement match display | `components/results/verdict-card.tsx` |
| 22 | Implement print report functionality | `components/results/print-report.tsx` |
| 23 | Add AI disclaimer component | `components/results/ai-disclaimer.tsx` |

### Phase 6: Landing & Finalization (Steps 24-28)

| # | Task | Files |
|---|---|---|
| 24 | Build landing page (hero, features, how-it-works, privacy) | `app/page.tsx`, `components/landing/*` |
| 25 | Add Framer Motion animations (page transitions, score reveals, stagger) | Across all pages |
| 26 | Responsive testing + mobile polish | Across all pages |
| 27 | Add Dockerfile + docker-compose.yml | `Dockerfile`, `docker-compose.yml` |
| 28 | Write README with setup instructions, screenshots, self-hosting guide | `README.md` |

---

## 13. Additional Features Included

These weren't explicitly requested but are important for a complete product:

| Feature | Why |
|---|---|
| **Dark mode** | Standard UX expectation, reduces eye strain |
| **Model selection** | Different models have different capabilities and costs |
| **Key validation** | Prevents frustration from typos or expired keys |
| **Retry on AI failure** | AI responses can occasionally be malformed |
| **Rotating loading tips** | 10-30s wait needs engagement |
| **Feedback filtering** | Long feedback lists need navigation |
| **Requirement match table** | Visual match/miss at a glance |
| **Actionable fixes** | Each issue includes how to fix it |
| **Clear data button** | Settings page option to wipe all localStorage |
| **Back navigation** | "Analyze Another" returns to review with fields cleared |
| **Mobile responsive** | Many users will use this on phones |
| **SEO meta tags** | For discoverability when self-hosted publicly |
| **Rate limiting** | Prevents abuse on shared deployments |

---

## 14. Future Considerations (Not in v1)

These are noted for future planning but **not implemented now**:

- Database integration (PostgreSQL/SQLite for storing past analyses)
- User accounts and authentication
- Resume history and comparison over time
- Multiple resume versions (A/B testing)
- Cover letter generation
- LinkedIn profile import
- Resume template suggestions
- Team/organization features
- Webhook notifications
- API endpoints for programmatic access
- i18n / multi-language support
- More AI providers (Anthropic Claude, Cohere, etc.)

---

## 15. File Size & Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| JS bundle (gzipped) | < 150 KB |
| Lighthouse score | > 90 (all categories) |
| Max file upload | 5 MB |
| Max text input | 10,000 characters |
| Analysis timeout | 60 seconds |
| Supported browsers | Chrome, Firefox, Safari, Edge (last 2 versions) |

---

*This plan is the complete blueprint. Each phase can be built and tested independently. The architecture is intentionally simple — no database, no auth, no server state — making it trivial to self-host and truly zero-knowledge.*
