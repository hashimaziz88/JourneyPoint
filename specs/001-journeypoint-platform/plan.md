# Implementation Plan: JourneyPoint Intelligent Onboarding Platform

**Branch**: `[codex/001-journeypoint-platform]` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-journeypoint-platform/spec.md`

## Summary

Build JourneyPoint as a multi-tenant onboarding platform across the existing ABP
backend and Next.js frontend, using a five-milestone delivery model:
foundation and access control, plan authoring and content ingestion, hire
enrolment and journey orchestration, participant experience with human-in-the-
loop AI, and engagement intelligence with intervention workflows.

## Technical Context

**Language/Version**: C# 12 on .NET 8; TypeScript 5 with React 19 and Next.js 16  
**Primary Dependencies**: ASP.NET Boilerplate, Entity Framework Core, PostgreSQL/Npgsql, Next.js App Router, Ant Design, antd-style, Axios, Recharts, PdfPig, Groq API client, Mailpit  
**Storage**: PostgreSQL for domain data; local filesystem for uploaded plan documents in the current phase  
**Testing**: dotnet test for backend projects, Playwright for end-to-end frontend verification, milestone smoke checks in quickstart  
**Target Platform**: Web application delivered as an ABP API backend and a Next.js frontend  
**Project Type**: Multi-tenant web application monorepo  
**Performance Goals**: Hire enrolment to journey draft under 60 seconds for the demo plan; pipeline and hire detail loads under 3 seconds for seeded demo data; markdown import preview under 10 seconds for standard onboarding tables  
**Constraints**: Preserve ABP multi-tenancy, keep AI backend-only and facilitator-triggered, keep engagement scoring on-demand for the current scope, ignore the Angular app, avoid inline styles and untyped `any` in frontend work, follow the internal ABP backend structure rules, keep provider state on the strict four-file contract, and extract regular nested components into dedicated files  
**Scale/Scope**: 11 core entities, 4 roles, 2 seeded tenants, 5 milestones, 25+ implementation issues, 1 end-to-end platform roadmap

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Principle I - Spec-Driven Delivery: This feature package is the active source
  of truth for the JourneyPoint application roadmap and implementation sequence.
- Principle II - Tenant Safety by Default: Every planned workflow remains
  tenant-scoped and avoids manual tenant bypasses.
- Principle III - Human-Governed AI: Document extraction and personalisation are
  explicitly facilitator-triggered, backend-only, and auditable.
- Principle IV - Layered Monorepo Integrity: The plan preserves ABP layering for
  backend work and the provider-based Next.js structure for frontend work.
- Principle V - Demoable Incremental Delivery: The roadmap is explicitly split
  into five demoable milestones with end-of-milestone validation paths.

## Project Structure

### Documentation (this feature)

```text
specs/001-journeypoint-platform/
|-- spec.md
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- github-roadmap.md
|-- contracts/
|   `-- rest-api.md
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
aspnet-core/
|-- src/
|   |-- JourneyPoint.Core/
|   |   |-- Authorization/
|   |   `-- Domains/
|   |-- JourneyPoint.Application/
|   |   |-- Authorization/
|   |   `-- Services/
|   |-- JourneyPoint.EntityFrameworkCore/
|   |   |-- EntityFrameworkCore/
|   |   `-- Migrations/
|   `-- JourneyPoint.Web.Host/
|       |-- Controllers/
|       `-- Startup/
`-- test/
    |-- JourneyPoint.Tests/
    `-- JourneyPoint.Web.Tests/

journeypoint/
|-- app/
|-- components/
|-- constants/
|-- helpers/
|-- hoc/
|-- providers/
|-- tests/
|-- types/
`-- utils/
```

**Structure Decision**: Use the existing ABP backend and Next.js frontend as the
delivery surfaces. New onboarding, journey, and intelligence domains will be
added inside the empty backend `Domains/` and `Services/` folders, while the
frontend will expand into role-specific route groups, providers, components,
types, and constants. The `angular/` directory remains explicitly out of scope.

## Company Standards Alignment

- These standards apply across the full five-milestone JourneyPoint roadmap,
  not only the current onboarding slice. Every future domain, AppService, EF
  mapping, migration, and frontend/provider addition must inherit the same
  rules unless a later approved spec amendment records an exception.
- Backend domain entities will be created under
  `aspnet-core/src/JourneyPoint.Core/Domains/<DomainArea>/` using audited ABP
  entity bases, explicit enums/constants, tenant-safe ownership, and XML
  comments on public classes and methods.
- New JourneyPoint product entities should default to `FullAuditedEntity<Guid>`
  unless the active spec explicitly records another key strategy.
- Entity validation should prefer data annotations, while aggregate and
  cross-entity rules should live in Core domain managers/services rather than
  entity method bodies.
- Backend implementation should preserve one-way dependencies only:
  `JourneyPoint.Web.Host` -> `JourneyPoint.Web.Core` ->
  `JourneyPoint.Application`, with `JourneyPoint.Application` and
  `JourneyPoint.EntityFrameworkCore` both depending downward on
  `JourneyPoint.Core`.
- Backend DTOs belong next to the app service that uses them under
  `aspnet-core/src/JourneyPoint.Application/Services/<Feature>/Dto/`; DTOs do
  not belong in the domain layer.
- Application services orchestrate use cases, while reusable business logic
  remains in domain services or the domain model.
- New application-service slices should keep interface-and-implementation pairs
  and use repository injection rather than direct `DbContext` access.
- `JourneyPoint.Web.Core` and `JourneyPoint.Web.Host` stay as plumbing-only
  layers; new business use cases must surface through Application services
  rather than host/controller logic.
- EF Core mappings and migrations should express persistence-only concerns that
  cannot or should not live in data annotations, such as table naming, enum
  conversions, indexes, and delete behavior.
- Frontend stateful modules must keep the strict provider folder contract:
  `actions.tsx`, `context.tsx`, `index.tsx`, and `reducer.tsx` only.
- Frontend bootstrap, session restoration, and other cross-cutting behavior
  must live outside provider folders.
- Regular React components must not declare child component definitions inside
  their function bodies; reusable children belong in `journeypoint/components/`
  or another dedicated top-level module.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| None | N/A | The current plan fits the existing monorepo structure and constitution without exception |
