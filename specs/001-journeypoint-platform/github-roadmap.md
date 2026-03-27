# JourneyPoint GitHub Roadmap

This document is the canonical JourneyPoint roadmap for current delivery.
Historical GitHub milestone or issue language that references Angular records
earlier foundation work only and does not define current scope.

## Snapshot of Existing GitHub State

Snapshot date: 2026-03-26

### Existing milestone

- Milestone `#1` - `M1-Foundation-and-Auth`
  - State: open
  - Closed issues: 3
  - Open issues: 0
  - Note: the description still references Angular, so it should be treated as
    historical foundation work rather than the canonical roadmap going forward.

### Existing closed issues

| GitHub Issue | Title | State | Milestone |
|-------------|-------|-------|-----------|
| #1 | [Frontend] feat : Implement Auth for frontend | CLOSED | M1-Foundation-and-Auth |
| #2 | [Backend] setup: Do Migrations and backend setup for PostgresSQL | CLOSED | M1-Foundation-and-Auth |
| #8 | [Frontend]: Deployed Multi tenancy not correctly resolving tenant and only logging into host | CLOSED | M1-Foundation-and-Auth |

### Existing merged pull requests

| GitHub PR | Title | Merged At | Branch |
|----------|-------|-----------|--------|
| #3 | Update database settings and restructure Docker setup | 2026-03-25T12:09:34Z | setup/backend-postgres-implement |
| #4 | Set ASPNETCORE_URLS for Render dynamic port support | 2026-03-25T12:31:43Z | setup/backend-postgres-implement |
| #5 | Setup/backend postgres implement | 2026-03-25T12:42:49Z | setup/backend-postgres-implement |
| #6 | Fix tenantId handling and improve cookie management in setTenantCookie | 2026-03-25T13:05:27Z | setup/backend-postgres-implement |
| #7 | Enhance CORS, authentication, and multi-tenancy support | 2026-03-26T07:26:45Z | feat/frontend-auth-multi-tenancy |
| #9 | bug: fix tenant management in AuthProvider and update axios instance | 2026-03-26T08:29:02Z | feat/frontend-auth-multi-tenancy |
| #10 | fix: correct tenantId constant and header format in axios instance | 2026-03-26T08:38:17Z | feat/frontend-auth-multi-tenancy |
| #11 | fix: reorder ABP initialization in Configure method for consistency | 2026-03-26T08:53:49Z | feat/frontend-auth-multi-tenancy |
| #12 | Implement multi-tenant proxy API and update Axios base URL | 2026-03-26T09:26:37Z | feat/frontend-auth-multi-tenancy |

### Canonical baseline

- Keep the existing issues and PRs as historical foundation work.
- Treat milestone `#1` and its Angular-oriented wording as legacy context only.
- Use the five milestones and issue slices below as the canonical JourneyPoint
  roadmap baseline.

## Canonical Five Milestones

| Milestone | Goal | Issue Count |
|----------|------|-------------|
| M1 - Platform Foundation and Access | Stabilize tenant-aware backend/frontend foundations and shared guidance | 6 |
| M2 - Plan Authoring and Content Ingestion | Deliver plan builder, markdown import, and document enrichment | 6 |
| M3 - Hire Enrolment and Journey Orchestration | Deliver hire creation, account creation, journey generation, and activation | 6 |
| M4 - Participant Experience and Human-in-the-Loop AI | Deliver enrolee, manager, and personalisation flows | 6 |
| M5 - Intelligence, Interventions, and Demo Readiness | Deliver scoring, pipeline, interventions, and seed validation | 6 |

Total canonical issues: 30

## Canonical Issues

### M1 - Platform Foundation and Access

1. **JP-001 - Replace Angular-oriented milestone language with JourneyPoint platform terminology**
   - Labels: planning, docs, github
   - Scope: rename or close the historical milestone and document the new roadmap baseline
   - Depends on: none
2. **JP-002 - Finalize root Spec Kit guidance and source-of-truth docs**
   - Labels: docs, speckit, agents
   - Scope: lock down constitution, project guide, active feature package, and cross-agent references
   - Depends on: JP-001
3. **JP-003 - Harden backend permission and role-seeding model for JourneyPoint actors**
   - Labels: backend, auth, tenancy
   - Scope: TenantAdmin, Facilitator, Manager, Enrolee roles and permissions
   - Depends on: JP-002
4. **JP-004 - Harden tenant-aware frontend authentication and session restoration**
   - Labels: frontend, auth, tenancy
   - Scope: session restoration, tenant resolution, protected route flow
   - Depends on: JP-003
5. **JP-005 - Create role-specific route shells and navigation**
   - Labels: frontend, ux, auth
   - Scope: facilitator, manager, and enrolee shells with role-aware navigation
   - Depends on: JP-004
6. **JP-006 - Centralize Groq, storage, and mail configuration contracts**
   - Labels: backend, configuration
   - Scope: option contracts and startup wiring for AI, storage, and welcome-email flows
   - Depends on: JP-003

### M2 - Plan Authoring and Content Ingestion

Milestone gate: begin M2 only after the current M1-owned guidance, shared
frontend shell/auth surfaces, and JourneyPoint-owned backend foundation files
have been normalized to the absorbed company engineering standards.

1. **JP-007 - Model onboarding plan, module, and template task entities**
   - Labels: backend, domain
   - Scope: reusable onboarding template entities and relationships
   - Depends on: JP-006
2. **JP-008 - Add onboarding persistence and migration support**
   - Labels: backend, database
   - Scope: DbContext registration and initial onboarding migration
   - Depends on: JP-007
3. **JP-009 - Implement onboarding plan CRUD application services**
   - Labels: backend, api
   - Scope: list, detail, create, update, publish, archive, clone flows
   - Depends on: JP-008
4. **JP-010 - Build facilitator plan builder UI and provider state**
   - Labels: frontend, ux
   - Scope: plan list, plan editor, module/task editing, provider state
   - Depends on: JP-009
5. **JP-011 - Implement markdown import preview and draft-save flow**
   - Labels: backend, frontend, import
   - Scope: markdown parsing service, preview UI, and save-as-draft flow
   - Depends on: JP-009
6. **JP-012 - Implement document upload and extraction proposal review**
   - Labels: backend, frontend, ai
   - Scope: upload storage, extraction orchestration, review UI, accept/edit/reject flow
   - Depends on: JP-009

### M3 - Hire Enrolment and Journey Orchestration

1. **JP-013 - Model hire, journey, and journey task entities**
   - Labels: backend, domain
   - Scope: hire lifecycle plus journey draft and task-copy model
   - Depends on: JP-008
2. **JP-014 - Add hire and journey persistence with follow-up migration**
   - Labels: backend, database
   - Scope: DbContext and migration updates for hire and journey aggregates
   - Depends on: JP-013
3. **JP-015 - Implement hire enrolment, account creation, and welcome-notification flow**
   - Labels: backend, onboarding
   - Scope: create hire, create account, assign role, send credentials
   - Depends on: JP-014
4. **JP-016 - Implement synchronous journey generation and draft review services**
   - Labels: backend, onboarding
   - Scope: copy plan tasks, compute due dates, draft review updates
   - Depends on: JP-015
5. **JP-017 - Build facilitator hire management and journey review UI**
   - Labels: frontend, ux
   - Scope: hire list, hire detail, journey review page, activation controls
   - Depends on: JP-016
6. **JP-018 - Add storage and resend-recovery support for onboarding communications**
   - Labels: backend, operations
   - Scope: file storage abstraction and welcome-email retry behavior
   - Depends on: JP-015

### M4 - Participant Experience and Human-in-the-Loop AI

1. **JP-019 - Add AI audit logging for personalisation and extraction**
   - Labels: backend, ai, audit
   - Scope: generation logs with outcome summary and timing
   - Depends on: JP-012
2. **JP-020 - Implement Groq journey personalisation service and selective acceptance workflow**
   - Labels: backend, ai
   - Scope: request assembly, diff-ready response parsing, selective apply
   - Depends on: JP-019
3. **JP-021 - Build enrolee journey dashboard and task detail workflow**
   - Labels: frontend, enrolee
   - Scope: module-grouped tasks, acknowledgement flow, mark-complete behavior
   - Depends on: JP-017
4. **JP-022 - Build manager task workspace**
   - Labels: frontend, manager
   - Scope: direct-report task list and manager completion flow
   - Depends on: JP-017
5. **JP-023 - Build facilitator personalisation diff UI**
   - Labels: frontend, ai
   - Scope: before/after comparison, per-task accept/reject, apply action
   - Depends on: JP-020
6. **JP-024 - Connect participant provider state across enrolee, manager, and facilitator flows**
   - Labels: frontend, state
   - Scope: journey provider updates and cross-role task refresh behavior
   - Depends on: JP-021, JP-022, JP-023

### M5 - Intelligence, Interventions, and Demo Readiness

1. **JP-025 - Model engagement snapshots and at-risk flags**
   - Labels: backend, domain, analytics
   - Scope: append-only score history and intervention records
   - Depends on: JP-014
2. **JP-026 - Implement engagement scoring domain service**
   - Labels: backend, analytics
   - Scope: completion, recency, overdue, composite score, classification logic
   - Depends on: JP-025
3. **JP-027 - Implement pipeline, hire intelligence, and intervention application services**
   - Labels: backend, api, analytics
   - Scope: on-demand computation, flag raising, flag resolution, profile payloads
   - Depends on: JP-026
4. **JP-028 - Build facilitator pipeline board and engagement badges**
   - Labels: frontend, analytics
   - Scope: Kanban board, filters, score badges, hire cards
   - Depends on: JP-027
5. **JP-029 - Build score trend chart and intervention history UI**
   - Labels: frontend, analytics
   - Scope: hire detail chart, active flag panel, intervention notes and history
   - Depends on: JP-027
6. **JP-030 - Seed demo tenants and run milestone validation walkthrough**
   - Labels: backend, demo, validation
   - Scope: Boxfusion and DeptDemo seed state plus milestone smoke validation
   - Depends on: JP-028, JP-029

## GitHub Alignment Guidance

1. Ensure GitHub milestone names align with the five canonical milestones above.
2. Rename or close milestone `#1` so Angular-oriented wording remains
   historical only.
3. Treat legacy issues `#1`, `#2`, and `#8`, plus merged PRs `#3` through
   `#12`, as historical foundation evidence rather than roadmap-defining slices.
4. Link ongoing PRs back to one canonical JP issue and one canonical milestone.
