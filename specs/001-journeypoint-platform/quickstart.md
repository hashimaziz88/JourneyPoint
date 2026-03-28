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

1. Enrol a hire into a published plan.
2. Confirm the new hire starts in `PendingActivation` and the generated journey
   starts in `Draft`.
3. Review the generated draft journey and confirm task payloads include copied
   snapshot fields plus optional source-template ids.
4. Edit the source onboarding plan after generation and confirm the draft
   journey task content does not mutate.
5. Activate the journey and confirm the hire moves to `Active`, the journey
   moves to `Active`, and due dates still reflect the hire start date.
6. Confirm account creation and welcome-notification flow.

### Milestone 4 - Journey Participation and Human-in-the-Loop AI

1. Sign in as an enrolee and complete a task.
2. Sign in as a manager and complete a manager-assigned task.
3. Trigger AI personalisation as a facilitator, review the diff, and accept a
   subset of the proposed changes.

### Milestone 5 - Intelligence and Interventions

1. Open the pipeline and confirm scores are computed.
2. Open a hire detail view and confirm historical snapshots appear.
3. Acknowledge and resolve an at-risk flag while preserving the intervention
   record.
4. Confirm touched backend and frontend surfaces still satisfy the package-wide
   engineering standards listed above.

## Seed Data Expectations

- Boxfusion tenant contains a graduate onboarding programme with hires across
  engaged, needs-attention, and at-risk bands.
- DeptDemo tenant contains a government onboarding programme with at least two
  hires at different journey stages.
- Four roles exist: TenantAdmin, Facilitator, Manager, Enrolee.
