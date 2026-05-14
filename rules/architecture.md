# Project Architecture Notes
> **AI Instruction:** All proposed solutions and code structures must align with these decisions.

## 1. High-Level Paradigm
- **Paradigm:** Stateless Next.js App Router application.
- **State Management:** Local React state only. No auth, DB, cache, or server-side persistence in v1.
- **Runtime:** Vercel serverless API route for AI calls. Resume and job description stay in memory.
- **Primary Flow:** Paste job description -> POST `/api/match` -> AI structured output -> render report.

## 2. Directory Structure
- `src/app/`: App Router pages, layout, global CSS, and API routes.
  - `src/app/page.tsx`: Single-page job matcher UI.
  - `src/app/api/match/route.ts`: Serverless match endpoint.
- `src/components/`: Reusable presentation components.
- `src/lib/`: Shared schemas, provider dispatch, prompts, and server helpers.
  - `src/lib/model-registry.ts`: Env-key driven AI provider selection.
  - `src/lib/match-schema.ts`: Zod schema and TypeScript types for match reports.
  - `src/lib/resume.ts`: Default resume loading from `HML.RESUME.md`.
- `rules/`: Agent-facing implementation rules.
- `agent_logs/`: Concise work logs by role.

Do not add top-level app directories unless needed by Next.js, tooling, or deployment.

## 3. Data Flow
1. User pastes job description in `src/app/page.tsx`.
2. Frontend validates non-empty input and calls `POST /api/match`.
3. API route loads default resume from `HML.RESUME.md` unless request includes `resume`.
4. API route selects first configured provider in priority order: OpenAI, Anthropic, Google.
5. AI SDK `generateObject()` returns a `MatchReport` matching `matchReportSchema`.
6. Frontend renders score, matched skills, missing skills, bonus skills, and notes.

## 4. Third-Party Integrations
- **Vercel AI SDK:** Used in `src/app/api/match/route.ts` for `generateObject()`.
- **OpenAI:** Configured in `src/lib/model-registry.ts` via `OPENAI_API_KEY`.
- **Anthropic:** Configured in `src/lib/model-registry.ts` via `ANTHROPIC_API_KEY`.
- **Google Generative AI:** Configured in `src/lib/model-registry.ts` via `GOOGLE_API_KEY`.
- **Tailwind CSS v4:** CSS-first styling in `src/app/globals.css`.

## 5. Constraints
- Do not store resume, job descriptions, or reports.
- Keep v1 single-page and free-tier friendly.
- Keep API response structured and schema-validated.
- Return explicit errors for empty input, too-long input, missing provider keys, and AI failures.
