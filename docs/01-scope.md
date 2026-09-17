# 01 — Scope

**Version:** 0.1-draft
**Status:** Draft — under review
**Last updated:** 2026-09-17
**Owner:** Prashrijan Shrestha

This document defines *what OpenMic is, who it's for, what we're building first, and what we are explicitly not building*. It is the source of truth for scope. Any request that isn't covered here is out of scope by default — either add it here first (through a revision) or defer it.

---

## 1. Problem Statement

Many people struggle with English communication in daily life — job interviews, meetings, presentations, small talk, and social situations. The struggle is not usually about grammar or vocabulary; it's about **confidence, fluency, and reps**. People need a low-stakes place to practice speaking with an intelligent partner, on topics that matter to them, and get useful feedback afterwards.

Existing options each fall short:

| Option | Problem |
|---|---|
| Talking to ChatGPT / Claude directly | No structure, no persistent progress, no roleplay setup, no feedback framework |
| Language-learning apps (Duolingo, Babbel) | Focused on vocabulary/grammar drills, not real conversation |
| Human tutors (iTalki, Preply) | Expensive, scheduled, judgmental for shy users |
| Peer practice communities | Hard to find, unreliable, quality varies |

**Our bet:** an AI-native product designed *specifically* for conversation practice — with scenarios, roleplay, coaching modes, and feedback — will be more valuable than any of these for the "I want to feel more confident talking" use case.

## 2. Target Users

OpenMic serves four overlapping audiences. All four share the same core need (low-stakes practice) but arrive with different pains. Onboarding will use a **"what do you want to practice?"** picker to route them into the right first experience.

### Primary personas

**P1. Working professional (Priya, 28, product manager, non-native English speaker)**
- Struggles in cross-team meetings, freezes during presentations.
- Wants to sound more articulate and confident.
- Practice targets: meeting facilitation, disagreements, presenting, 1:1s.

**P2. ESL learner (Kenji, 22, computer science student, intermediate English)**
- Reads and writes fine, but conversational fluency lags.
- Wants natural back-and-forth, not textbook drills.
- Practice targets: everyday small talk, describing opinions, storytelling.

**P3. Early-career job seeker (Ana, 24, recent graduate)**
- Preparing for interviews, networking events, and first-job pressure.
- Practice targets: behavioral interviews, elevator pitch, coffee chats.

**P4. Socially anxious adult (Sam, 32, remote worker)**
- Fluent in English but struggles with the mechanics of talking.
- Practice targets: small talk, phone calls, expressing opinions, difficult conversations.

### Non-users (v0.1)

- Non-English speakers who want to practice other languages.
- Users under 13 (no product design for kids in scope).
- Users seeking clinical speech therapy (not a medical product).

## 3. Product Vision

> OpenMic is the place you go to practice a conversation before it happens.

You pick a scenario (or open topic), talk with an AI partner that stays in character, and afterwards get a short feedback report that helps you improve. Over time, the product learns what you're working on and gets more useful.

**Design principles:**

- **Low stakes over polish.** Better to feel safe practicing than to feel judged. Coaching is opt-in intensity.
- **Reps over lessons.** Volume of practice is the biggest lever. Reduce friction to *start* a session.
- **Conversation over content.** We are not a course. We are a partner.
- **Small feedback beats big feedback.** A short, actionable end-of-session report beats a wall of corrections.

## 4. MVP Scope (v0.1)

Everything below must be shipped for v0.1 to be considered launched. If it's not listed here, it's out of scope for v0.1.

### 4.1 Features

- **Onboarding**
  - Guest mode: 1–2 free sessions with no signup
  - "What do you want to practice?" picker (interviews / meetings / small talk / ESL fluency / general)
  - Signup wall after guest quota (email + Google via Supabase Auth)
- **Session start**
  - Scenario catalog (10–15 curated starter scenarios grouped by category)
  - Free-form topic input ("I want to practice explaining my project to non-technical people")
  - Roleplay mode: pick the AI's role (interviewer, colleague, friend, stranger, etc.)
  - Difficulty setting (easy / normal / challenging)
- **Conversation (text-only in v0.1)**
  - Chat UI with typing indicator and turn-taking
  - AI stays in character for the duration of the session
  - User can end the session anytime; sessions auto-cap at ~15 minutes to keep feedback actionable
- **Feedback**
  - User-configurable mode toggle: **Natural-flow** (no interruptions, feedback only at the end) or **Coach** (inline gentle suggestions during the chat)
  - End-of-session report: strengths, growth areas, notable moments, 1–3 concrete suggestions
- **Persistence**
  - Session history for signed-in users (last 30 sessions)
  - Ability to revisit past feedback reports
- **Account**
  - Basic profile (name, goals, preferred practice areas)
  - Delete account / delete history

### 4.2 Non-features (v0.1 explicit non-goals)

To keep v0.1 shippable in ~2 months at 5–10 hrs/week, the following are **out of scope**:

- Voice input / voice output (deferred to v0.2)
- Peer-to-peer practice / matching with real users (deferred to v0.3+)
- Games and structured drills (deferred to v0.3+)
- Progress tracking / streaks / gamification (deferred)
- Mobile native app (deferred; web is responsive)
- Payment / subscription (deferred; v0.1 is free)
- Team / organization features
- Non-English languages
- Video calls, avatars, or animated characters
- Content moderation dashboard (users only; simple flag button is enough for v0.1)

## 5. Phased Release Plan

Realistic pacing at 5–10 hrs/week solo build:

| Version | Target | Scope | Ship criteria |
|---|---|---|---|
| **v0.1** | ~Week 8 (2026-11-12) | Text-only conversation MVP as scoped above | 10 external users complete ≥1 session and give feedback |
| **v0.2** | ~Week 14 (2026-12-24) | Voice mode (OpenAI Realtime), inline nudges | 50% of v0.1 users try voice mode |
| **v0.3** | ~Week 22 (2027-02-18) | Games/drills, progress tracking, streaks | Retention: 30% of signups return within 7 days |
| **v0.4+** | TBD | Peer matching, mobile (React Native), monetization | To be scoped after v0.3 |

Dates are targets, not commitments. Reality-check every 2 weeks against actual velocity.

## 6. Success Criteria

### 6.1 v0.1 launch success (leading indicators)

- ≥10 real external users complete an unmoderated session end-to-end
- ≥50% of guest sessions convert to signup within 7 days
- Median session length ≥5 minutes (proxy for "user found it valuable")
- Zero P0 bugs open at launch (crashes, data loss, auth failures)

### 6.2 Product-market fit signals (v0.2 and beyond)

- 30-day retention ≥25% among signed-in users
- Users returning ≥3× in the first week
- Unprompted user feedback: "this helped me" / "I felt more prepared"

### 6.3 Non-metrics (things we will not optimize for in v0.1)

- Session count / vanity engagement metrics
- DAU / MAU curves (too early, sample too small)
- Revenue (v0.1 is free)

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Voice pipeline complexity blows up timeline in v0.2 | High | High | Ship v0.1 text-only first; voice is a follow-on, not a launch dependency |
| LLM cost per session exceeds budget once real users show up | Medium | Medium | Cap session length; use Claude Haiku for cheap conversational turns, Claude Sonnet only for feedback reports; monitor spend from day 1 |
| AI feedback quality feels generic or preachy | High | High | Invest in prompting for feedback report specifically; test with 3–5 friends before launch |
| Guest mode gets abused (free session farming) | Medium | Low | Rate limit by IP; keep guest quota small |
| Solo builder burnout at 5–10 hrs/week over 5+ months | Medium | High | Enforce phased release; reward yourself at each milestone; write retros |
| "OpenMic" name is taken (broadcasting app exists) | Medium | Low | Use `getopenmic.com` or similar; decide at brand time, not blocking |
| No user demand — solves a problem people don't pay for | Low-Medium | High | v0.1 is free and validates demand before any monetization work |

## 8. Assumptions

These are load-bearing beliefs. If any turn out false, we revisit scope.

1. Users are willing to talk to an AI about their communication struggles (not too embarrassing / not too impersonal).
2. LLM-generated feedback on communication is *useful*, not just *plausible-sounding*. → **Validate early with real users.**
3. Guest mode → signup conversion is high enough to sustain growth.
4. Anthropic Claude API remains available and priced reasonably through 2026.
5. Prashrijan can commit 5–10 focused hours per week consistently for ~2 months.

## 9. Tech Direction (summary — full detail in [03-architecture.md](03-architecture.md))

- **Frontend / Framework:** Next.js 15 (App Router) + TypeScript
- **Data / Auth:** Supabase (Postgres + Auth)
- **LLM (text):** Anthropic Claude — Haiku for conversation turns, Sonnet for feedback reports
- **LLM (voice, v0.2):** OpenAI Realtime API
- **Hosting:** Vercel
- **Analytics:** PostHog (free tier) or Plausible — TBD in architecture doc
- **Error tracking:** Sentry (free tier)

## 10. Open Questions

Questions we don't need to answer to start, but must answer before their respective phase:

- [ ] Final brand name & logo direction (defer to design phase)
- [ ] Domain: `getopenmic.com` vs. `openmic.chat` vs. other
- [ ] Content moderation strategy for user-generated topics
- [ ] Privacy policy / terms of service authoring
- [ ] How persistent memory of user preferences should work (per-session vs. long-term profile)
- [ ] Whether to include a "share your feedback report" social feature (v0.3?)

## 11. Change Log

| Date | Change | Author |
|---|---|---|
| 2026-09-17 | Initial draft based on discovery interview | Prashrijan + Claude |
