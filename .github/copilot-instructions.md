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
- use the Next.js App Router instead of legacy `pages/` routing
- use providers for stateful frontend features
- do not add inline styles
- do not use untyped `any`
- keep JourneyPoint-owned handwritten frontend and backend source files at or
  under 350 lines, excluding generated artifacts such as migration designers,
  model snapshots, and build output
- follow the internal backend structure standard: domain entities in
  `JourneyPoint.Core/Domains/<DomainArea>/`, DTOs next to their app services,
  and no domain logic in AppServices
- default new product entities to `FullAuditedEntity<Guid>` unless the active
  spec records another key strategy
- use data annotations for entity validation and move aggregate rules into Core
  domain services or managers
- add XML comments to public backend classes and public methods
- prefer guard clauses, early returns, and low nesting in backend methods; use
  `Ardalis.GuardClauses` when reusable guard support is introduced
- keep provider modules on the strict four-file contract only
- interpret absorbed company frontend standards through JourneyPoint's real
  stack by using App Router and `antd-style`, not conflicting legacy guidance
- do not declare regular nested React components inside other functional
  component bodies
- move loose helper methods, constants, interfaces, and sample data into
  dedicated modules or top-level folders instead of large component, provider,
  or service files
