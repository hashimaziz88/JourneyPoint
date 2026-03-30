# Quickstart: JourneyPoint Intelligent Onboarding Platform

## Prerequisites

- .NET 8 SDK
- Node.js 20+ and npm
- PostgreSQL
- Mailpit or another local SMTP catcher
- Groq API key for live extraction and personalisation checks

## Backend Setup

```powershell
cd aspnet-core
dotnet run --project src/JourneyPoint.Migrator
dotnet run --project src/JourneyPoint.Web.Host
```

Expected result:

- database migrations apply successfully
- ABP API starts
- Swagger is available

## Frontend Setup

```powershell
cd journeypoint
npm install
npm run dev
```

Expected result:

- Next.js starts locally
- authenticated routes can reach the backend through the configured proxy flow

## Required Configuration

- Backend connection strings point to PostgreSQL.
- Backend mail settings point to Mailpit or another SMTP target.
- Backend Groq settings include a valid model and API key.
- Frontend environment points to the backend base URL or proxy entrypoint.

## Standards Validation Expectations

- New backend entities follow the active spec package contract:
  `FullAuditedEntity<Guid>` by default, data-annotation validation, and domain
  manager/service ownership for aggregate rules.
- New application-service slices expose interface-and-implementation pairs,
  keep DTOs under `JourneyPoint.Application/Services/<Feature>/Dto/`, and use
  repositories instead of direct `DbContext` access.
- New persistence slices register `DbSet` properties, keep EF-only concerns in
  `JourneyPoint.EntityFrameworkCore`, and generate migrations from that layer.
- New Web.Core and Web.Host changes stay plumbing-only.
- New frontend provider work preserves the four-file provider contract and
  keeps bootstrap or side-effect logic outside provider folders.
- New frontend route and data-loading work preserves Next.js App Router
  patterns and does not regress to legacy `pages/`, `getServerSideProps`, or
  `getStaticProps` approaches.
- New frontend styling work uses `antd-style` and dedicated style modules
  rather than inline styles or Tailwind-first deviations.
- New frontend provider, component, and API-contract work keeps TypeScript
  types explicit and avoids untyped `any`.

## Milestone Validation Flow

### Milestone 1 - Foundation and Access Control

1. Sign in as a tenant-scoped user.
2. Confirm the correct tenant context is resolved.
3. Confirm role-specific navigation is shown.

### Milestone 2 - Plan Authoring and Content Ingestion

1. Create a draft onboarding plan manually.
2. Import rough markdown or a document into a second draft plan through the review preview.
3. Upload a document to a saved plan and review extracted task proposals.

### Milestone 3 - Hire Enrolment and Journey Orchestration

1. Create a hire against a published plan and confirm the new hire starts in
   `PendingActivation`.
2. Confirm a tenant-scoped platform account is created and assigned only the
   `Enrolee` role, with optional manager linkage accepted only for a same-tenant
   manager.
3. Confirm the initial welcome-notification attempt reports either `Sent` or a
   recoverable failure state without rolling back the hire or account.
4. Generate the draft journey and confirm the operation completes
   synchronously and the journey starts in `Draft`.
5. Review the generated draft journey and confirm task payloads include copied
   snapshot fields, preserved ordering and assignment rules, and optional
   source-template ids.
6. Confirm generated due dates match the hire start date plus copied day
   offsets.
7. Update one draft task, add one facilitator-authored draft task, and remove
   one pending draft task while confirming the underlying onboarding template
   records do not mutate.
8. Activate the journey and confirm the hire moves to `Active`, the journey
   moves to `Active`, and due dates still reflect the hire start date.
9. Open the facilitator hire list page and confirm same-tenant hires render
   with lifecycle and welcome-notification summaries.
10. Open one hire detail page and confirm hire metadata, manager/account state,
   and journey summary render correctly.
11. Open the facilitator journey review page, repeat the draft-edit flow through
   the UI, activate the journey, and confirm provider-backed state refreshes
   without route or styling regressions.

### Milestone 4 - Journey Participation and Human-in-the-Loop AI

1. Sign in as an enrolee and open `/enrolee/my-journey`.
2. Confirm the dashboard shows only the signed-in enrolee's active journey,
   grouped by module, with task status, due dates, and any personalised task
   indicators.
3. Open one task detail route and confirm the task description,
   acknowledgement requirement, completion state, and personalised indicator
   match the dashboard summary.
4. Attempt to complete an acknowledgement-gated task and confirm completion is
   blocked until acknowledgement is submitted successfully.
5. Acknowledge and complete an eligible enrolee-owned task, then reload the
   dashboard and confirm module progress and task status update correctly.
6. Attempt to access another participant's task id and confirm the backend
   rejects the request.
7. Sign in as a manager and complete a manager-assigned task.
8. Open the facilitator journey review page, trigger AI personalisation for a
   same-tenant draft or active journey, and confirm the response renders a
   clear per-task before/after diff review state without mutating any tasks
   yet.
9. Accept some task diffs, reject others, and confirm the apply action reflects
   only the accepted selection count.
10. Apply the accepted subset and confirm only the selected pending task
    snapshots change, while rejected or unselected diffs and source onboarding
    templates remain unchanged.
11. Reload the enrolee dashboard after an applied AI revision and confirm the
    personalised indicator persists on the affected task.
12. Re-run the flow after manually editing a task between request and apply, and
    confirm the stale apply is rejected until a fresh diff is generated.
13. Confirm the personalisation request writes an AI audit record with workflow
    type `Personalisation`, status, timing, and revision summary metadata.

### Milestone 5 - Intelligence and Interventions

1. Open the pipeline and confirm engagement computation appends a fresh
   snapshot instead of overwriting prior history.
2. Open a hire detail view and confirm historical snapshots appear in
   chronological order for the same hire and journey.
3. Drive a hire below the at-risk threshold and confirm one unresolved flag is
   raised with the original classification and raised-at context preserved.
4. Acknowledge the active flag and confirm the record shows acknowledgement
   metadata without being resolved yet.
5. Resolve the flag and confirm the same record now includes resolution
   metadata while preserving the original raised and acknowledged history.
6. Confirm touched backend and frontend surfaces still satisfy the package-wide
   engineering standards listed above.

## Seed Data Expectations

- Boxfusion tenant contains a graduate onboarding programme with hires across
  engaged, needs-attention, and at-risk bands.
- DeptDemo tenant contains a government onboarding programme with at least two
  hires at different journey stages.
- Four roles exist: TenantAdmin, Facilitator, Manager, Enrolee.
