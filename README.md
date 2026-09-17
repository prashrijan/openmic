# OpenMic

Practice English communication with an AI that talks back.

OpenMic is an AI-powered platform for people who want to feel more confident talking — in interviews, meetings, small talk, and everyday life. Pick a scenario, jump into a conversation with an AI partner, and get feedback afterwards.

**Status:** In development. Currently in the requirements phase of v0.1. See [`docs/01-scope.md`](docs/01-scope.md) for what's shipping first.

## Who this is for

- Working professionals who freeze up in meetings, presentations, or small talk
- ESL / English learners building conversational fluency
- Students and early-career folks prepping for interviews and networking
- Anyone who wants a low-stakes place to practice talking out loud

## Repo map

```
openmic/
├── docs/                   SDLC artifacts (source of truth for the project)
│   ├── 00-index.md         Doc index
│   ├── 01-scope.md         Scope, goals, non-goals, phased release plan
│   ├── 02-requirements.md  Functional + non-functional requirements
│   ├── 03-architecture.md  System design, data model, integrations
│   ├── decisions/          ADRs — one file per architectural decision
│   └── retros/             Post-milestone retrospectives
├── design/                 Visual design system, mockups, assets
│   ├── DESIGN.md           Falu Room design system
│   ├── mockups/
│   └── assets/
└── web/                    Next.js application (see web/README.md)
    ├── src/app/            App Router pages + API routes
    ├── src/components/     UI components (shadcn/ui + custom)
    ├── src/lib/            Supabase, Anthropic, auth, rate-limit
    ├── src/proxy.ts        Next.js 16 edge proxy (guest cookie)
    └── supabase/           Migrations
```

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack) + TypeScript + React 19
- **Data / Auth:** Supabase (Postgres + Auth)
- **LLM (text):** Anthropic Claude — Haiku for conversation turns, Sonnet for feedback reports
- **Voice (v0.2+):** OpenAI Realtime API for speech-in / speech-out
- **UI:** Tailwind CSS 4 + shadcn/ui (restyled to Falu Room)
- **Fonts:** Fraunces (variable serif) + Public Sans (humanist sans), via `next/font/google`
- **Package manager:** pnpm
- **Testing:** Vitest + Testing Library + happy-dom
- **Hosting:** Vercel

## Roadmap

- **v0.1** — text-only conversation partner, topic/scenario picker, guest mode → signup, end-of-session feedback, feedback-mode toggle
- **v0.2** — voice mode via OpenAI Realtime, inline feedback nudges
- **v0.3+** — communication games/drills, progress tracking, peer-to-peer practice, mobile (React Native)

## Development

Requires Node.js 20+, pnpm (via `brew install pnpm`), and a Supabase project + Anthropic API key.

```bash
cd web
cp .env.example .env.local
# Fill in .env.local with your Supabase URL/keys and Anthropic key.
# Generate GUEST_COOKIE_HMAC_SECRET with: openssl rand -hex 32
pnpm install
pnpm dev             # http://localhost:3000
pnpm test            # Vitest unit tests
pnpm typecheck       # TypeScript check
pnpm build           # Production build
```

Current state (2026-09-17):
- ✅ SCOPE, REQUIREMENTS, ARCHITECTURE, DESIGN documents complete
- ✅ Next.js app scaffolded with Supabase + Anthropic wiring, guest-cookie proxy, and Falu Room design tokens
- 🟡 v0.1 features (Task #8): scenarios, sessions, chat, feedback reports

## License

MIT © 2026 Prashrijan Shrestha
