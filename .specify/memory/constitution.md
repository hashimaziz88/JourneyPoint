<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Spec-Driven Delivery
- [PRINCIPLE_2_NAME] -> II. Tenant Safety by Default
- [PRINCIPLE_3_NAME] -> III. Human-Governed AI
- [PRINCIPLE_4_NAME] -> IV. Layered Monorepo Integrity
- [PRINCIPLE_5_NAME] -> V. Demoable Incremental Delivery
Added sections:
- Project Technical Guardrails
- Delivery Workflow & Quality Gates
Removed sections:
- Placeholder tokens and template-only guidance
Templates requiring updates:
- ✅ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\AGENTS.md
- ✅ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\CLAUDE.md
- ✅ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\journeypoint\AGENTS.md
- ✅ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\journeypoint\CLAUDE.md
- ✅ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\.github\copilot-instructions.md
- ✅ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\.specify\project.md
- ⚠ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\.specify\templates\plan-template.md (no structural change required; constitution enforced through project docs and generated plans)
- ⚠ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\.specify\templates\spec-template.md (no structural change required; constitution enforced through project docs and generated specs)
- ⚠ C:\Users\Hashim\Documents\Git Repos\JourneyPoint\.specify\templates\tasks-template.md (no structural change required; constitution enforced through project docs and generated tasks)
Follow-up TODOs:
- None
-->
# JourneyPoint Constitution

## Core Principles

### I. Spec-Driven Delivery

Every meaningful change MUST map to an active feature under `specs/`, and that
feature MUST contain an up-to-date `spec.md`, `plan.md`, and `tasks.md` before
implementation expands beyond exploratory setup. Agents and contributors MUST
read the constitution, project guide, active feature files, and role-specific
guidance before changing code. Work that materially diverges from the active
spec MUST update the spec first or pause for alignment.

Rationale: JourneyPoint is intended to produce consistent outcomes across
multiple AI agents and human contributors. Shared artifacts are the only stable
way to make that repeatable.

### II. Tenant Safety by Default

Tenant isolation MUST be preserved by ABP infrastructure and respected in every
feature. Contributors MUST NOT bypass tenant resolution, manually disable tenant
filters to simplify feature work, or introduce frontend flows that can access
another tenant's plans, hires, journeys, flags, or analytics. Seed data,
automation, and demo scenarios MUST clearly separate Boxfusion and DeptDemo
tenants.

Rationale: JourneyPoint's value proposition depends on a single deployment
supporting multiple organizations safely, including future public-sector use
cases.

### III. Human-Governed AI

All AI interactions MUST be backend-only, explicit, auditable, and reversible.
Groq or any future model integration MUST never be invoked directly from the
frontend. AI enrichment and personalisation MUST require a clear facilitator
action, MUST produce reviewable outputs before adoption, and MUST create an
audit trail that captures outcome metadata and response summaries.

Rationale: JourneyPoint uses AI to accelerate onboarding design and improve
journey quality, not to remove facilitator oversight or create opaque decisions.

### IV. Layered Monorepo Integrity

The backend MUST preserve ABP layering: domain rules in `JourneyPoint.Core`,
orchestration and DTOs in `JourneyPoint.Application`, persistence and external
integration wiring in `JourneyPoint.EntityFrameworkCore`, and HTTP hosting in
`JourneyPoint.Web.Host`. The frontend MUST use the Next.js App Router, typed
provider-based state for stateful features, `antd-style` for styling, and MUST
avoid inline styles and untyped `any` usage. The `angular/` application is out
of scope and MUST NOT influence current planning or implementation.

Rationale: Consistent structure is what allows multiple contributors and agents
to work in parallel without re-deciding architecture on each task.

### V. Demoable Incremental Delivery

Work MUST be sliced into independently demonstrable increments that align with
the active milestone roadmap. Each milestone MUST end with a coherent demoable
outcome, not just hidden infrastructure. Critical user paths MUST include
verification steps, demo seed data where relevant, and clear definitions of
done. Stretch features MUST remain optional until all milestone-critical flows
work end to end.

Rationale: JourneyPoint is being built as a staged product with visible progress
gates. Delivering demoable increments reduces risk and keeps planning grounded.

## Project Technical Guardrails

- The supported application stack is ASP.NET Boilerplate on .NET 8, PostgreSQL,
  Next.js 16 App Router, TypeScript, Ant Design, `antd-style`, Axios, Recharts,
  PdfPig, and Groq accessed from the backend.
- Uploaded onboarding documents MAY use local filesystem storage in the current
  phase, but storage access MUST be abstracted so cloud storage can be swapped
  later.
- Engagement scoring in the current scope MUST remain on-demand rather than
  scheduler-driven; background jobs are reserved for later milestones or
  stretch work.
- Role-based behavior MUST distinguish TenantAdmin, Facilitator, Manager, and
  Enrolee responsibilities end to end.
- Historical data for AI runs, engagement snapshots, and at-risk interventions
  MUST be retained in a way that preserves auditability.

## Internal Engineering Standards

- The internal company backend structure, C# coding standards, frontend coding
  standards, TypeScript rules, and strict provider-pattern guidance supplied to
  this project are now normative for JourneyPoint work.
- Backend work MUST follow the documented ABP layer structure: entities, enums,
  and domain rules in `JourneyPoint.Core`; DTOs and application services in
  `JourneyPoint.Application/Services/`; persistence in
  `JourneyPoint.EntityFrameworkCore`; no business logic in controllers or host
  startup wiring.
- New product entities MUST be created under
  `JourneyPoint.Core/Domains/<DomainArea>/`, use audited ABP entity bases, keep
  tenant ownership explicit, and favor enums/constants over magic numbers.
- New product entities SHOULD default to `FullAuditedEntity<Guid>` unless the
  active spec records a different key strategy.
- Entity validation SHOULD prefer data annotations, while aggregate and
  cross-entity rules SHOULD live in Core domain services or managers instead of
  entity method bodies.
- Public backend classes and public methods MUST include XML comments, and
  non-obvious logic MUST be preceded by a short explanatory comment.
- Frontend stateful features MUST stay on the strict four-file provider
  contract only: `actions.tsx`, `context.tsx`, `index.tsx`, and `reducer.tsx`.
  Bootstrap or cross-cutting side effects MUST live outside provider folders.
- Frontend architecture MUST follow Next.js 16 App Router conventions. Older
  Pages Router patterns such as `pages/`, `getServerSideProps`, and
  `getStaticProps` are considered legacy guidance and MUST be translated into
  App Router equivalents before use in this repo.
- Frontend styling MUST use `antd-style` and existing project styling patterns.
  Tailwind-first or inline-style approaches from older notes MUST NOT override
  this repo's styling contract.
- Regular functional components MUST NOT declare nested React component
  definitions inside their bodies. Reusable child components belong in
  `components/` or another dedicated top-level module.
- Frontend TypeScript MUST prefer explicit interfaces, avoid untyped `any`, and
  keep provider actions, state, and API payloads typed end to end.
- Existing legacy code does not justify carrying older patterns forward. New
  work and touched code MUST move toward these stricter standards without broad
  unrelated rewrites.

## Delivery Workflow & Quality Gates

- The canonical project guide is `.specify/project.md`.
- The canonical constitution is this file. `.specify/constitution.md` may exist
  as a stable pointer, but this file remains authoritative.
- The active delivery package for the current initiative is
  `specs/001-journeypoint-platform/`.
- New milestone or issue planning MUST be captured in markdown before GitHub
  creation so other agents can reproduce the same roadmap.
- Any change to cross-agent operating rules MUST update the shared agent docs in
  the repo root and the GitHub Copilot instructions.
- Before closing a milestone-sized change, contributors MUST verify that the
  relevant spec, plan, tasks, and roadmap artifacts still match the codebase.
- Before starting new implementation work, contributors MUST consult the
  in-repo guidance that now encodes the internal company standards rather than
  relying on external side notes alone.

## Governance

This constitution supersedes ad hoc preferences, stale prompt snippets, and
feature-local shortcuts. Amendments require:

1. an explicit documentation change to this file,
2. a semantic version decision recorded in the Sync Impact Report,
3. updates to affected guidance files or an explicit note explaining why no
   propagation was needed.

Versioning policy:

- MAJOR: breaking changes to principles or removal of mandatory guardrails
- MINOR: new principles or materially expanded governance
- PATCH: clarifications that do not change expected behavior

Compliance review expectations:

- Specs and plans MUST cite how they satisfy the constitution.
- Tasks MUST reflect constitution-driven work such as tenant safety, audit
  logging, and demo validation where applicable.
- Reviews SHOULD reject changes that bypass the constitution even if the code
  appears locally correct.

**Version**: 1.1.0 | **Ratified**: 2026-03-26 | **Last Amended**: 2026-03-27
