# GitHub Copilot Instructions - JourneyPoint

This repository uses spec-driven delivery.

`AGENTS.md` is the root operating guide for repository guidance.

## Canonical Source of Truth

After reading `AGENTS.md`, follow this order:

1. `.specify/memory/constitution.md`
2. `.specify/project.md`
3. the active feature package `specs/001-journeypoint-platform/`:
   `spec.md`, `plan.md`, `tasks.md`, and `github-roadmap.md`
4. lower-priority assistant guidance files such as this file, `CLAUDE.md`, and
   `.codex/context.md`

Stack:

- ASP.NET Boilerplate on .NET 8
- PostgreSQL
- Next.js 16 App Router with TypeScript
- Ant Design plus antd-style

Rules:

- keep `specs/001-journeypoint-platform/` as the active feature package unless
  the project docs explicitly change it
- ignore `angular/`
- preserve ABP layering
- preserve tenant and auth behavior
- keep AI services backend-only and reviewable
- use providers for stateful frontend features
- do not add inline styles
- do not use untyped `any`
- follow the internal backend structure standard: domain entities in
  `JourneyPoint.Core/Domains/<DomainArea>/`, DTOs next to their app services,
  and no domain logic in AppServices
- add XML comments to public backend classes and public methods
- keep provider modules on the strict four-file contract only
- do not declare regular nested React components inside other functional
  component bodies
- follow the internal backend structure standard: domain entities in
  `JourneyPoint.Core/Domains/<DomainArea>/`, DTOs next to their app services,
  and no domain logic in AppServices
- add XML comments to public backend classes and public methods
- keep provider modules on the strict four-file contract only
- do not declare regular nested React components inside other functional
  component bodies
