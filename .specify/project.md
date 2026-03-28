# JourneyPoint Project Guide

## Product Summary

JourneyPoint is a multi-tenant onboarding platform for designing reusable
onboarding plans, enriching them with imported or AI-extracted content,
enrolling hires into guided journeys, tracking completion and engagement, and
surfacing at-risk interventions early.

## Source of Truth Order

1. `.specify/memory/constitution.md`
2. the active feature package in `specs/001-journeypoint-platform/`
3. `specs/001-journeypoint-platform/github-roadmap.md`
4. root agent guidance files: `AGENTS.md`, `CLAUDE.md`,
   `.github/copilot-instructions.md`
5. Codex supplements in `.codex/`
6. supporting repo-local company reference copies in `docs/company-standards/`

If two documents disagree, prefer the higher item in this list and update the
lower one before continuing.

The active feature package remains `specs/001-journeypoint-platform/` for the
current initiative even when contributors work from task-specific or
documentation branches. Do not infer a different feature package from branch
names or legacy GitHub milestone wording.

## Internal Standards Baseline

The company coding standards and architecture references provided for
JourneyPoint are now absorbed into the repo guidance and are no longer optional
side references.

- Backend expectations follow the supplied ABP backend structure and C# coding
  standards.
- Frontend expectations follow the supplied Next.js, TypeScript, and strict
  provider-pattern standards.
- JourneyPoint-owned frontend and backend source files touched by milestone
  work are now subject to a hard 350-line limit, excluding generated files
  such as migration designers, model snapshots, and build output.
- Those frontend standards are interpreted through JourneyPoint's actual stack:
  Next.js 16 App Router, React 19, TypeScript, Ant Design, and `antd-style`.
  Conflicting legacy references such as `pages/`, `getServerSideProps`,
  `getStaticProps`, or Tailwind-first styling must be normalized before use.
- When older local code conflicts with these standards, new work MUST follow
  the stricter documented rule unless a higher-priority source-of-truth
  document explicitly permits an exception.

## Active Delivery Scope

The current delivery initiative is a five-milestone implementation plan:

1. Foundation and access control
2. Plan authoring and content ingestion
3. Hire enrolment and journey orchestration
4. Journey participation and human-in-the-loop AI
5. Intelligence, interventions, and demo readiness

This five-milestone plan is the canonical JourneyPoint roadmap for the current
initiative. Any older GitHub milestone or issue wording that references Angular
must be treated as historical foundation context only and must not override the
active feature package or roadmap markdown.

The active feature package must remain detailed enough that Claude, ChatGPT,
Codex, and GitHub Copilot can continue work from the same documented intent.

## Repository Layout

```text
aspnet-core/
├── src/
│   ├── JourneyPoint.Core
│   ├── JourneyPoint.Application
│   ├── JourneyPoint.EntityFrameworkCore
│   ├── JourneyPoint.Web.Core
│   └── JourneyPoint.Web.Host
└── test/
    ├── JourneyPoint.Tests
    └── JourneyPoint.Web.Tests

journeypoint/
├── app/
├── components/
├── providers/
├── utils/
└── tests/

angular/   # Explicitly ignored for current planning and implementation
specs/     # Active Spec Kit feature packages
```

## Delivery Rules

- Keep backend work aligned to ABP layer boundaries.
- Keep frontend stateful features aligned to the four-file provider contract.
- Keep frontend route, data-loading, and styling work aligned to App Router and
  `antd-style`, not legacy Pages Router or Tailwind assumptions.
- Keep backend domain entities under `JourneyPoint.Core/Domains/<DomainArea>/`
  and DTOs next to their app services under
  `JourneyPoint.Application/Services/<Feature>/Dto/`.
- Keep domain logic out of AppServices except for orchestration.
- Default new product entities to `FullAuditedEntity<Guid>` with explicit
  tenant ownership unless the active spec records a different key strategy.
- Use data annotations for entity validation and relationship hints; keep
  EF-only persistence configuration in EntityFrameworkCore.
- Put aggregate and cross-entity rules into Core domain services or managers
  rather than embedding them directly in entity method bodies.
- Add XML comments to public backend classes and public methods, plus short
  comments for non-obvious logic.
- Keep JourneyPoint-owned source files at or under 350 lines unless they are
  generated artifacts such as EF migration designers, snapshots, or build
  output.
- Prefer guard clauses and early returns in backend methods; use
  `Ardalis.GuardClauses` when introducing reusable guard-clause support.
- Prefer guarded, small, cohesive methods and classes; replace magic numbers
  with constants or enums.
- Keep regular React components free of nested component declarations; extract
  child components into `components/` or another dedicated module.
- Keep provider state, actions, and API contracts explicitly typed; use
  `unknown` instead of `any` when a boundary is temporarily uncertain.
- Keep loose helper methods, interfaces, constants, and sample data in
  dedicated modules or top-level folders such as `components/`, `layout/`,
  `types/`, `constants/`, `helpers/`, `hoc/`, and `utils/` rather than inside
  large component, provider, or service files.
- Keep all AI calls in backend services only.
- Treat Boxfusion and DeptDemo as separate tenants in every plan, seed dataset,
  and demo workflow.
- Prefer reusable domain concepts over one-off demo shortcuts.
- Preserve audit history for AI runs, engagement scoring, and interventions.
- Update the roadmap markdown before or alongside any major issue re-slicing.
- Treat Angular-oriented milestone labels in historical GitHub records as
  legacy context rather than active roadmap language.

## Working Commands

```powershell
dotnet run --project aspnet-core/src/JourneyPoint.Web.Host
dotnet run --project aspnet-core/src/JourneyPoint.Migrator
dotnet test aspnet-core/test/JourneyPoint.Tests/JourneyPoint.Tests.csproj
dotnet test aspnet-core/test/JourneyPoint.Web.Tests/JourneyPoint.Web.Tests.csproj

cd journeypoint
npm install
npm run dev
npm run lint
npm run test:e2e
```

## Domain Boundaries

- Plan authoring: plans, modules, template tasks, markdown import, document
  enrichment
- Journey orchestration: hires, accounts, generated journeys, review, activation
- Participation: enrolee and manager task execution
- Intelligence: scoring, snapshots, flags, pipeline, intervention history
- Demo readiness: multi-tenant seeds, milestone walkthroughs, operational docs

## Current Non-Goals

- Reworking or extending the Angular application
- Replacing ABP multi-tenancy with custom tenant plumbing
- Moving AI calls to the browser
- Adding background schedulers before the milestone roadmap says they are ready
