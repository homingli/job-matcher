# Project Plan
> **AI Instruction:** Treat this file as the absolute source of truth for the project's state. When asked what we are building or what the next steps are, refer to this document.

## Vision Statement
A lightweight web app deployed on Vercel. User pastes a job description → AI compares it against HML.RESUME.md → returns a structured fit assessment with match score, skill gaps, and tailored suggestions. No auth. No DB. Pure utility.

## Scope & Constraints
- **In scope:**
  - Paste job description (text input)
  - AI matching engine: resume vs. job description
  - Display fit score (0–100%), skill match breakdown, gaps, and bonus/miss items
  - Deployed on Vercel, single-page app
  - Configurable resume source (default: HML.RESUME.md)

- **Out of scope:**
  - User accounts / authentication
  - Resume parsing from PDF/DOCX
  - Job board API integrations
  - Multi-resume support (v1)
  - History / persistence (v1)

- **Constraints:**
  - Free-tier friendly (Vercel Hobby + free/cheap AI API)
  - Low latency target: <5s response
  - No backend database — stateless, serverless functions only
  - Privacy: resume and JD stay in-memory, never stored

## System Architecture

```
┌──────────────┐     HTTP POST      ┌─────────────────┐     AI Call      ┌──────────────┐
│   Frontend   │ ──────────────────► │  Vercel API     │ ───────────────► │  AI Provider │
│  (Next.js)   │  {resume, jd}      │  Route (Route)  │  {resume+jd}   │  (OpenAI/    │
│              │ ◄────────────────── │                 │ ◄────────────── │   Anthropic) │
│  Paste JD    │  {fit report}       │  Prompt + parse │  {raw response}│              │
│  View result │                     │                 │                └──────────────┘
└──────────────┘                     └─────────────────┘
```

- **Core Entity:** MatchReport — structured output from AI: `{score, matched_skills, missing_skills, bonus_skills, notes}`
- **Data Flow:** User pastes JD → frontend sends resume + JD to Vercel API → API constructs prompt → calls AI → parses JSON response → returns to frontend → renders fit assessment
- **Primary Interfaces:** Single-page UI (input form + result cards), Vercel API route
- **Key Dependencies:**
  - AI: Vercel AI SDK (`@ai-sdk/core`) — abstracts provider away. Swappable by env key presence.
  - Provider priority (if multiple keys set): OpenAI > Anthropic > Google
  - Vercel for hosting + serverless API
  - Next.js App Router for frontend + API co-location

## Tech Stack
| Layer        | Choice                           | Rationale                                          |
| ------------ | -------------------------------- | -------------------------------------------------- |
| Framework    | Next.js 15 (App)                 | Vercel-native, routes + pages same repo            |
| UI           | Tailwind CSS v4 + shadcn/ui      | Latest Tailwind (v4): CSS-first config, zero JS, faster build |
| AI Provider  | Swappable: env-key driven dispatch | Pick provider by which API key exists (priority order) |
| Deploy       | Vercel                           | Zero config, auto CI/CD from git                    |
| Env secrets  | `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` | Vercel env vars; presence = availability           |
| AI SDK       | `@ai-sdk/core` (Vercel AI SDK)  | Unified interface for OpenAI, Anthropic, Google    |

## Roadmap
> `[x]` done · `[/]` in progress · `[ ]` next

### Phase 1: MVP Core
- `[x]` Write project plan (this file)
- `[x]` Scaffold Next.js project (Tailwind v4, shadcn-style local components)
- `[x]` Build AI provider dispatch (`lib/model-registry.ts`)
- `[x]` Create Vercel API route (`/api/match`) with prompt + structured output
- `[x]` Build frontend: textarea for JD paste, submit, loading state, result display
- `[ ]` Deploy to Vercel (preview + production)

### Phase 2: Refinement
- `[ ]` Add skill category breakdown (cloud, AI, security, comms, etc.)
- `[ ]` Improve prompt engineering for nuanced scoring
- `[ ]` Add export/share result (copy-to-clipboard or generate image)
- `[ ]` Handle edge cases: empty input, too-long JD, API errors
- `[ ]` Add README

### Phase 3: Hardening & Observability
- `[ ]` Add rate limiting (Vercel rate limit or Redis)
- `[ ]` Add usage logging (Vercel analytics or simple counter)
- `[ ]` Consider adding history (localStorage or optional Supabase)
- `[ ]` Cost monitoring (track tokens used per call)

## Current Execution Status
- **Current Task:** MVP build verification
- **Recent accomplishment:** Updated project rules, scaffolded Next.js app, built provider dispatch, match API, and frontend UI
- **Blocked By:** None
- **Next Steps (next 1–3):**
  1. Install dependencies and run `npm run build`
  2. Configure one provider key in `.env.local` or Vercel
  3. Deploy to Vercel preview

## Risks & Assumptions
- **Key risks:**
  - AI response cost if JDs are long (token blowup)
  - AI hallucination or inconsistent scoring across calls
  - Free tier limits on OpenAI/Anthropic
  - Vercel Hobby cold starts for API route

- **Assumptions:**
  - User has a Vercel account (or uses personal deployment)
  - At least one AI API key available (OpenAI preferred, Anthropic/Google fallback)
  - Resume stays static (HML.RESUME.md); updates require code change or env var override
  - User accepts AI score as guidance, not absolute truth
  - AI SDK structured output (`generateObject`) works reliably across providers

---

## AI Provider Selection (Swappable)

Runtime dispatch based on env key presence. Vercel AI SDK (`@ai-sdk/core`) abstracts all providers to one interface.

**Priority order** (first key found wins):
1. `OPENAI_API_KEY` → `openai:gpt-4o-mini` (default, cheapest)
2. `ANTHROPIC_API_KEY` → `anthropic:claude-sonnet-4-20250514` (best analysis quality)
3. `GOOGLE_API_KEY` → `google:gemini-2.5-flash` (cheap alternative)
4. No key → 500 error

Model choice is swappable without code changes — just set/drop the env key.

### Provider Priority Diagram

```
Provider Selection (runtime):
  OPENAI_API_KEY set? ──yes──► openai:gpt-4o-mini
       │no
       ▼
  ANTHROPIC_API_KEY set? ──yes──► anthropic:claude-sonnet-4
       │no
       ▼
  GOOGLE_API_KEY set? ──yes──► google:gemini-2.5-flash
       │no
       ▼
  ERROR: No provider configured
```

### Model Comparison

| Model                        | Cost (in)  | Cost (out)  | Speed | Best for              |
| ---------------------------- | ---------- | ----------- | ----- | --------------------- |
| `gpt-4o-mini`                | $0.15/M    | $0.60/M     | Fast  | Cheapest, reliable    |
| `claude-sonnet-4-20250514`   | $3.00/M    | $15.00/M    | Med   | Best nuanced analysis |
| `gemini-2.5-flash`           | $0.10/M    | $0.40/M     | Fast  | Budget alternative    |

### Provider Dispatch

```ts
// lib/model-registry.ts
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getModel() {
  if (process.env.OPENAI_API_KEY)
    return createOpenAI('gpt-4o-mini');
  if (process.env.ANTHROPIC_API_KEY)
    return createAnthropic('claude-sonnet-4-20250514');
  if (process.env.GOOGLE_API_KEY)
    return createGoogleGenerativeAI('gemini-2.5-flash');
  throw new Error('No AI provider configured — set at least one API key');
}
```

### Adding a New Provider

1. Add env var constant
2. Insert into priority chain in `model-registry.ts`
3. Add model comparison row in this table
4. Zero frontend changes needed.

### Structured Output

Vercel AI SDK `generateObject()` enforces JSON schema (zod) output — consistent `{score, matched_skills, missing_skills, bonus_skills, notes}` regardless of provider.

### Fallback Chain (optional, future)

If primary provider fails (rate limit, error):
- Retry once with same provider
- If still failing → fall back to next available provider
- Logged in error response

---

## Prompt Template (draft)

```
You are a career matching assistant. Compare the candidate's resume against the job description.

CANDIDATE RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return a JSON object with this exact structure:
{
  "score": <int 0-100>,
  "matched_skills": ["list of matched skill keywords"],
  "missing_skills": ["list of required but missing skills"],
  "bonus_skills": ["nice-to-have skills the candidate has but job doesn't require"],
  "experience_match": "<short note on experience level fit>",
  "notes": "<2-3 sentence assessment>"
}

Rules:
- Score 70+ means strong fit, 50-69 decent fit, below 50 weak fit.
- Be precise. Don't invent skills.
- If a skill is mentioned in any form (tool, concept, responsibility), count it as matched.
```
