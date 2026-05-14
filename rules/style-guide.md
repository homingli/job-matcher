# Coding Style & Standards
> **AI Instruction:** Write all code according to these rules.

## TypeScript
- Use strict TypeScript.
- Export public types from schema modules when possible.
- Use Zod for request/response shape validation.
- Avoid `any`. Use `unknown` plus parsing when input is external.

## React / Next.js
- Use Server Components by default.
- Use Client Components only for interactivity.
- Keep `src/app/page.tsx` as the single v1 experience.
- Keep API logic in `src/app/api/*/route.ts`.
- Avoid global state libraries in v1.

## Formatting & Naming
- Functions stay short and focused.
- Variables/functions: `camelCase`.
- Components/types/interfaces: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Prefer explicit names over abbreviations.

## UI
- Quiet utility UI, not marketing landing page.
- First screen is usable job matcher.
- Use dense, readable result sections.
- Keep cards simple, radius 8px or less.
- Ensure mobile and desktop text does not overflow.

## Error Handling
- Do not swallow exceptions silently.
- Return useful API errors with proper HTTP status.
- Show user-facing failures in the frontend without exposing secrets or raw provider details.

## Comments & Documentation
- Comments explain why, not what.
- Public exported functions need short doc comments.

## Testing / Validation
- Run `npm run build` before handoff when dependencies are available.
- Add focused tests later when shared logic grows or scoring rules become local code.
