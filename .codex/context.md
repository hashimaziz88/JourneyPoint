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

Before implementing any feature, use `specs/001-journeypoint-platform/` as the
source of truth together with `.specify/memory/constitution.md` and
`.specify/project.md`.
