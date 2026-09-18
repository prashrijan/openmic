# 05 — Testing strategy

**Version:** 0.1
**Status:** 🟢 v0.1 baseline in place
**Last updated:** 2026-09-18

Modest but meaningful test coverage for v0.1. Not chasing 100% — chasing high-value tests that catch real regressions in the pieces that hurt most when they break.

## 1. What we test with

- **Vitest** — unit tests. Fast, native ES modules, per-file `@vitest-environment` docblock support.
- **@testing-library/react** — installed but not yet used. Component tests come in v0.2.
- **happy-dom** — default environment. Node environment used for server-only modules via `@vitest-environment node`.
- **No Playwright yet.** E2E is deferred to v0.2 or the first serious regression that would have been caught by it.

## 2. What's covered today

30 tests across 4 files:

| Suite | Tests | Coverage |
|---|---|---|
| `src/lib/auth/guest-cookie.test.ts` | 7 | HMAC signing round-trip, tamper detection, hash stability |
| `src/lib/anthropic/prompts.test.ts` | 7 | System prompt composition across scenario/custom, difficulty variants, feedback mode variants, standing rules |
| `src/lib/anthropic/feedback-report.test.ts` | 6 | Zod schema for feedback report content (min/max cardinality, item length, missing fields) |
| `src/lib/sessions/session-config.test.ts` | 10 | Zod schema for CreateSessionInput (mutual exclusivity, UUID validation, min/max lengths, enum validation) |

## 3. What we deliberately don't test yet

- **API route handlers end-to-end.** These require mocking Supabase and Anthropic; the cost of the mocks vs. their value for a solo-dev project at this stage isn't there.
- **UI components.** We don't have any complex client components yet that reward isolated testing — most components are thin wrappers around server data. When we add complex client state (voice mode, multi-turn coaching), component tests come with them.
- **Full E2E flows.** Playwright would catch integration regressions but takes ~1-2 hours to set up and configure per Vercel deploy. Deferred to v0.2.

## 4. When to add a test

- **Before every bug fix.** Write a failing test that reproduces the bug, then fix.
- **When the schema changes.** Session config, feedback report — anything Zod-validated deserves a test.
- **When the prompt changes.** buildSystemPrompt has strong tests specifically because a broken prompt fails silently in production (the AI just gets slightly off, no exception is thrown).
- **NOT for aesthetic UI changes.** Layout, spacing, typography — those don't get tests. They get eyeballs.

## 5. Running tests

```bash
cd web
pnpm test          # single run
pnpm test:watch    # watch mode during dev
pnpm typecheck     # TypeScript check — treat failures as hard errors
```

## 6. CI

Not wired up yet. GitHub Actions setup lands in a follow-up ADR before v0.2.

Minimum viable CI (when we add it):
- Run on every PR against `main`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Block merge on failure

## 7. Change log

| Date | Change | Author |
|---|---|---|
| 2026-09-18 | Initial v0.1 testing strategy | Prashrijan + Claude |
