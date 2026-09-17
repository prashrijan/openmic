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
│   ├── DESIGN.md           Design system (produced via design-md-planner skill)
│   ├── mockups/
│   └── assets/
└── app/                    Next.js application (scaffolded in Task #7)
```

## Tech stack (planned)

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Data / Auth:** Supabase (Postgres + Auth + Storage)
- **LLM:** Anthropic Claude for text conversation and coaching
- **Voice (v0.2+):** OpenAI Realtime API for speech-in / speech-out
- **Hosting:** Vercel

## Roadmap

- **v0.1** — text-only conversation partner, topic/scenario picker, guest mode → signup, end-of-session feedback, feedback-mode toggle
- **v0.2** — voice mode via OpenAI Realtime, inline feedback nudges
- **v0.3+** — communication games/drills, progress tracking, peer-to-peer practice, mobile (React Native)

## Development

App scaffolding lands in Task #7 of the roadmap. For now, only documentation exists — this is the requirements/design phase of the SDLC.

## License

MIT © 2026 Prashrijan Shrestha
