# JourneyPoint Agent Guide

This is the root operating guide for repository contributors and assistant
tools.

## Canonical Source of Truth

Before making or proposing changes, follow this order:

1. `.specify/memory/constitution.md`
2. `.specify/project.md`
3. the active feature package `specs/001-journeypoint-platform/`:
   `spec.md`, `plan.md`, `tasks.md`, and `github-roadmap.md`
4. lower-priority assistant guidance files such as `CLAUDE.md`,
   `.github/copilot-instructions.md`, and `.codex/context.md`
5. `.codex/backend.md` or `.codex/frontend.md` as relevant

If two documents disagree, prefer the higher item and update the lower item
before continuing.

The active feature package is currently `001-journeypoint-platform`. Do not
infer a different package from the current branch name or from historical
GitHub milestone wording.

## Project Identity

JourneyPoint is a multi-tenant onboarding platform built with:

- ASP.NET Boilerplate on .NET 8
- PostgreSQL
- Next.js 16 App Router with TypeScript
- Ant Design plus antd-style
- Groq API from the backend only

The `angular/` application is out of scope and must be ignored.

## Non-Negotiable Rules

- Respect ABP layering across Core, Application, EntityFrameworkCore, and Web.Host.
- Preserve tenant isolation and do not bypass ABP tenant handling for convenience.
- Keep all AI calls backend-only, explicit, reviewable, and auditable.
- Use provider-based state for stateful frontend features.
- Do not use inline styles.
- Do not use `any` in TypeScript.
- Map meaningful implementation work back to the active feature tasks and issue roadmap.

## Working Protocol

For implementation or review work, always state:

- active spec or milestone
- active task IDs or roadmap issue IDs
- assumptions made
- files changed
- any remaining mismatch between code and spec
