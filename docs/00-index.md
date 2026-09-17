# Documentation Index

This folder is the source of truth for OpenMic. Each document maps to a phase of the software development lifecycle.

## Core documents

| # | Document | Status | Purpose |
|---|---|---|---|
| 01 | [Scope](01-scope.md) | 🟢 complete (v0.1-draft) | Problem, users, MVP scope, non-goals, phased release, success criteria, risks |
| 02 | [Requirements](02-requirements.md) | 🟢 complete (v0.1-draft) | Functional + non-functional requirements, user stories, acceptance criteria |
| 03 | [Architecture](03-architecture.md) | 🟢 complete (v0.1-draft) | System diagram, data model, API surface, LLM integration, deployment topology |
| 04 | [API Contracts](04-api-contracts.md) | ⚪ not started | Public API routes, request/response shapes, error codes |
| 05 | [Testing Strategy](05-testing-strategy.md) | ⚪ not started | Unit / integration / E2E approach, coverage targets, CI |
| 06 | [Deployment](06-deployment.md) | ⚪ not started | Environments, secrets, CI/CD, monitoring, rollback |

## Supporting folders

- [`decisions/`](decisions/) — Architecture Decision Records (ADRs). One file per meaningful decision. Immutable once merged.
- [`retros/`](../docs/retros/) — Post-milestone retrospectives. What worked, what didn't, what to change next.

## Design

The design system lives in [`../design/DESIGN.md`](../design/DESIGN.md) — **Falu Room**, Nordic Calm with an editorial-serif accent. Lints clean against `@google/design.md`. Status: 🟢 complete.

## Legend

- ⚪ not started
- 🟡 in progress
- 🟢 complete
- 🔴 blocked
