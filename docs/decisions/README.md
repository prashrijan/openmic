# Architecture Decision Records (ADRs)

An ADR captures a single architectural or product decision, the context around it, the options considered, and the chosen outcome. ADRs are **append-only** — once merged, they are never edited. If a decision changes, write a new ADR that supersedes the old one.

## Format

Each ADR is a numbered markdown file: `NNNN-short-slug.md` (e.g., `0001-use-nextjs-app-router.md`).

```markdown
# ADR NNNN: Short title

- **Status:** Proposed | Accepted | Superseded by [ADR-NNNN] | Deprecated
- **Date:** YYYY-MM-DD
- **Deciders:** who was in the room

## Context
What is the situation, constraint, or problem that prompts this decision?

## Options considered
1. Option A — pros / cons
2. Option B — pros / cons
3. Option C — pros / cons

## Decision
We will do X.

## Consequences
- Positive: ...
- Negative: ...
- Neutral: ...

## References
Links to docs, issues, PRs, prior art.
```

## When to write one

- Choosing between two or more real alternatives (LLM provider, database, auth model, etc.)
- Introducing or removing a major dependency
- Changing a cross-cutting pattern (error handling, logging, state management)
- Any decision that a future maintainer will ask "why did we do it this way?" about

## When _not_ to write one

- Local implementation details (variable names, private helpers)
- Reversible choices with no cost to change later
