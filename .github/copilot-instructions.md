# GitHub Copilot Instructions - JourneyPoint

This repository uses spec-driven delivery.

Read first:

1. `AGENTS.md`
2. `.specify/memory/constitution.md`
3. `.specify/project.md`
4. `specs/001-journeypoint-platform/spec.md`
5. `specs/001-journeypoint-platform/plan.md`
6. `specs/001-journeypoint-platform/tasks.md`
7. `specs/001-journeypoint-platform/github-roadmap.md`

Stack:

- ASP.NET Boilerplate on .NET 8
- PostgreSQL
- Next.js 16 App Router with TypeScript
- Ant Design plus antd-style

Rules:

- ignore `angular/`
- preserve ABP layering
- preserve tenant and auth behavior
- keep AI services backend-only and reviewable
- use providers for stateful frontend features
- do not add inline styles
- do not use untyped `any`
