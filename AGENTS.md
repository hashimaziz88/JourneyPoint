# JourneyPoint Agent Guide

## Read Order

Before making or proposing changes, read these in order:

1. `.specify/memory/constitution.md`
2. `.specify/project.md`
3. `specs/001-journeypoint-platform/spec.md`
4. `specs/001-journeypoint-platform/plan.md`
5. `specs/001-journeypoint-platform/tasks.md`
6. `specs/001-journeypoint-platform/github-roadmap.md`
7. `.codex/context.md` plus `.codex/backend.md` or `.codex/frontend.md` as relevant

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
