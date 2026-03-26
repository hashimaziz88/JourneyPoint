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

If two documents disagree, prefer the higher item in this list and update the
lower one before continuing.

## Active Delivery Scope

The current delivery initiative is a five-milestone implementation plan:

1. Foundation and access control
2. Plan authoring and content ingestion
3. Hire enrolment and journey orchestration
4. Journey participation and human-in-the-loop AI
5. Intelligence, interventions, and demo readiness

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
- Keep all AI calls in backend services only.
- Treat Boxfusion and DeptDemo as separate tenants in every plan, seed dataset,
  and demo workflow.
- Prefer reusable domain concepts over one-off demo shortcuts.
- Preserve audit history for AI runs, engagement scoring, and interventions.
- Update the roadmap markdown before or alongside any major issue re-slicing.

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
