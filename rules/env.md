# Environment & CLI Rules
> **AI Instruction:** Follow these rules for local commands, deployment, and secrets.

## Shell Environment
- Prefer project-local binaries: `npm run <script>` or `npx <tool>`.
- If common binaries are missing, source shell profile before retrying.
- Check standard paths only after local binaries fail.

## Required Runtime
- Node.js 20+.
- npm 10+ preferred.
- Vercel deploy target.

## Package Commands
- `npm install`: install dependencies.
- `npm run dev`: start local Next.js dev server.
- `npm run build`: production build check.
- `npm run lint`: lint when configured.

## Environment Variables
At least one provider key must be set:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`

Provider priority:
1. OpenAI
2. Anthropic
3. Google

Optional:
- `RESUME_PATH`: custom local resume markdown path for server runtime.

## Secret Handling
- Never commit real API keys.
- Use `.env.local` for local secrets.
- Use Vercel project environment variables for deploy.
- Do not log resume text, job descriptions, provider keys, raw prompts, or raw AI responses.

## Privacy
- Resume and JD remain in memory only.
- No database, analytics payload, history, or persistence in v1.
