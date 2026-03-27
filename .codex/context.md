# JourneyPoint Codex Context

## Product

JourneyPoint is an intelligent onboarding platform for managing onboarding
plans, content ingestion, hire enrolment, journey generation, AI enrichment,
engagement scoring, and at-risk follow-up.

## Tech stack

- Backend: ASP.NET Boilerplate on .NET 8
- Database: PostgreSQL
- Frontend: Next.js App Router, TypeScript, Ant Design, antd-style
- AI: Groq API via backend only
- Multi-tenancy: enforced through ABP infrastructure

## Operating rule

`AGENTS.md` is the root operating guide for Codex work in this repository.

Use this source-of-truth order before implementing any feature:

1. `.specify/memory/constitution.md`
2. `.specify/project.md`
3. the active feature package `specs/001-journeypoint-platform/`:
   `spec.md`, `plan.md`, `tasks.md`, and `github-roadmap.md`
4. `.codex/context.md`, then `.codex/backend.md` or `.codex/frontend.md` as
   relevant

Do not infer the active feature package from branch names. Ignore the
`angular/` application for current planning and implementation.

The company's internal backend and frontend standards have been absorbed into
the repo guidance. Treat `.specify/memory/constitution.md`,
`.specify/project.md`, `.codex/backend.md`, and `.codex/frontend.md` as the
in-repo canonical summary of those standards for future work.
