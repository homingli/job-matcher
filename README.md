# Job Matcher

Lightweight web app for matching a pasted job description against `HML.RESUME.md`.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15 App Router, React 19, Tailwind CSS v4 |
| API | Vercel serverless route at `/api/match` |
| AI | Vercel AI SDK with OpenAI, Anthropic, or Google |
| Storage | None |

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set at least one key in `.env.local`:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
```

Provider priority is OpenAI, then Anthropic, then Google.

## Commands

```bash
npm run dev
npm run build
npm run start
```

## Project Files

- `PLAN.md`: source of truth for roadmap and status.
- `HML.RESUME.md`: default resume source.
- `src/app/page.tsx`: single-page matcher UI.
- `src/app/api/match/route.ts`: structured AI match endpoint.
- `src/lib/model-registry.ts`: provider dispatch.
- `rules/`: agent-facing project rules.
- `agent_logs/`: work logs.
