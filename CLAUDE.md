# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the root operating guide for this repository. Read it first, then follow the canonical source-of-truth order it defines before making any changes.

## Canonical Source of Truth

1. `.specify/memory/constitution.md`
2. `.specify/project.md`
3. `specs/001-journeypoint-platform/`: `spec.md`, `plan.md`, `tasks.md`, `github-roadmap.md`
4. `.codex/backend.md` or `.codex/frontend.md` as relevant
5. This file, `.github/copilot-instructions.md`, `.codex/context.md`

If two documents disagree, prefer the higher item and update the lower one before continuing. The active feature package is always `specs/001-journeypoint-platform/` — do not infer a different package from the current branch name.

## Development Commands

### Backend

```bash
# Run database migrations
dotnet run --project aspnet-core/src/JourneyPoint.Migrator

# Start the API server (Swagger available after start)
dotnet run --project aspnet-core/src/JourneyPoint.Web.Host

# Run tests
dotnet test aspnet-core/test/JourneyPoint.Tests/JourneyPoint.Tests.csproj
dotnet test aspnet-core/test/JourneyPoint.Web.Tests/JourneyPoint.Web.Tests.csproj

# Add a new EF Core migration (run from the EntityFrameworkCore project directory)
dotnet ef migrations add <MigrationName> --project aspnet-core/src/JourneyPoint.EntityFrameworkCore
```

### Frontend

```bash
cd journeypoint
npm install
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm run lint     # ESLint
npm run test:e2e # Playwright end-to-end tests
```

### Prerequisites

- .NET 8 SDK, PostgreSQL, Node.js 20+
- Mailpit or another local SMTP catcher
- Groq API key (backend only — never expose to frontend)
- Connection strings, mail settings, and Groq config in `aspnet-core/src/JourneyPoint.Web.Host/appsettings.json`

## Architecture Overview

JourneyPoint is a multi-tenant onboarding platform structured as a monorepo:

```text
aspnet-core/src/
├── JourneyPoint.Core              # Domain entities, enums, domain services/managers, permissions
├── JourneyPoint.Application       # Application services, DTOs, AutoMapper profiles
├── JourneyPoint.EntityFrameworkCore  # DbContext, EF config, migrations
├── JourneyPoint.Web.Core          # API controller base classes (plumbing only)
└── JourneyPoint.Web.Host          # Startup, appsettings, hosting wiring (no business logic)

aspnet-core/test/
├── JourneyPoint.Tests
└── JourneyPoint.Web.Tests

journeypoint/                      # Next.js 16 App Router frontend
├── app/
│   ├── (facilitator)/             # Facilitator route group
│   ├── (manager)/                 # Manager route group
│   └── (enrolee)/                 # Enrolee route group
├── components/                    # Shared reusable React components
├── providers/                     # Stateful feature providers (strict four-file contract)
├── utils/                         # Helpers, constants, type utilities
└── tests/                         # Playwright e2e tests

angular/   # Explicitly out of scope — ignore entirely
specs/     # Spec Kit feature packages
```

### Backend Layering Rules

- **Core**: Domain entities (`FullAuditedEntity<Guid>` by default), enums, domain managers/services. New entities go under `JourneyPoint.Core/Domains/<DomainArea>/`.
- **Application**: Application services (interface + implementation pairs), DTOs under `Services/<Feature>/Dto/`, AutoMapper profiles. No domain logic here — orchestration only.
- **EntityFrameworkCore**: `DbSet` registration, EF Fluent API config, migrations. All persistence concerns stay here.
- **Web.Core / Web.Host**: Plumbing only. No business logic in controllers or startup wiring.

### Frontend Provider Contract

Stateful feature modules use a strict four-file provider structure:

```text
providers/<featureName>Provider/
├── actions.tsx    # Action creators / action type constants
├── context.tsx    # React context definition and consumer hook
├── index.tsx      # Provider component (combines context + reducer)
└── reducer.tsx    # State shape and reducer
```

Bootstrap, auth/session restoration, and cross-cutting side effects must live **outside** provider folders.

### AI Integration

Groq is the only AI provider. All calls are backend-only through application services. No AI calls from the frontend. AI enrichment requires explicit facilitator action and produces auditable records in the database before any changes are applied.

### Multi-Tenancy

Two demo tenants: **Boxfusion** (graduate onboarding) and **DeptDemo** (government onboarding). ABP handles tenant resolution automatically — never bypass tenant filters. Demo users all use password `123qwe`; see `specs/001-journeypoint-platform/quickstart.md` for the full login matrix.

## Non-Negotiable Guardrails

- No inline styles anywhere in the frontend
- No untyped `any` in TypeScript — use `unknown` at uncertain boundaries
- Keep all JourneyPoint-owned handwritten source files at or under 350 lines (generated artifacts like EF migration designers and build output are excluded)
- No nested React component declarations inside functional component bodies — extract to `components/` or a dedicated module
- Move loose helpers, constants, interfaces, and sample data into dedicated modules rather than accumulating inside component, provider, or service files
- Use `antd-style` for styling; no Tailwind, no inline styles
- Use Next.js App Router (`app/`) patterns only — no `pages/`, `getServerSideProps`, or `getStaticProps`
- Public backend classes and methods require XML comments
- New entities default to `FullAuditedEntity<Guid>` with data annotations for validation; aggregate rules go in Core domain services/managers
- Prefer guard clauses, early returns, and low nesting in backend methods

## Working Protocol

When reporting implementation work, always state:

- Active spec or milestone
- Active task IDs (from `specs/001-journeypoint-platform/tasks.md`)
- Assumptions made
- Files changed
- Any remaining mismatch between code and spec
