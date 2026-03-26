# Feature Specification: JourneyPoint Intelligent Onboarding Platform

**Feature Branch**: `[001-journeypoint-platform]`  
**Created**: 2026-03-26  
**Status**: Draft  
**Input**: User description: "Consolidate the JourneyPoint source specification into
fully detailed Spec Kit artifacts, a five-milestone implementation plan, and a
GitHub-ready roadmap that multiple AI agents can follow consistently."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Establish Foundation and Access Control (Priority: P1)

As a tenant administrator or facilitator, I need a reliable multi-tenant
foundation with authenticated role-aware access so the onboarding platform can
be used safely before feature-specific workflows are introduced.

**Why this priority**: Every downstream workflow depends on tenant separation,
role permissions, stable login, and shared project guidance that all
contributors can follow.

**Independent Test**: This story is independently valuable if a tenant
administrator can sign in, resolve tenant context correctly, and access the
correct role-specific shell without exposing another tenant's data.

**Acceptance Scenarios**:

1. **Given** a host or tenant login request, **When** a user authenticates,
   **Then** the system resolves the correct tenant context and grants access
   only to the screens permitted by that role.
2. **Given** two configured tenants, **When** users from each tenant access the
   platform, **Then** each tenant sees only its own users, plans, journeys, and
   analytics data.
3. **Given** a contributor opens the repository, **When** they read the project
   guidance, **Then** they can identify the active spec, roadmap, and rules that
   govern future implementation work.

---

### User Story 2 - Author and Enrich Reusable Onboarding Plans (Priority: P1)

As a facilitator, I need to create onboarding plans manually, import plan
content from markdown, and enrich published plans with AI-reviewed document
extractions so I can reuse structured onboarding content instead of recreating
it for every intake.

**Why this priority**: Reusable onboarding plans are the core asset that powers
every subsequent journey. Without them, enrolment and tracking have nothing to
deliver.

**Independent Test**: This story is independently valuable if a facilitator can
create a draft plan, import structured markdown into modules and tasks, upload a
document to a published plan, review extracted task suggestions, and publish the
resulting plan for future enrolments.

**Acceptance Scenarios**:

1. **Given** a facilitator is editing a draft plan, **When** they add or reorder
   modules and tasks, **Then** the system preserves the intended module order and
   task due-day offsets.
2. **Given** a facilitator pastes structured markdown or uploads a markdown
   file, **When** the system parses headings and task rows, **Then** the
   facilitator sees a preview they can edit before saving a new draft plan.
3. **Given** a facilitator uploads a document to a published plan, **When** the
   system proposes extracted tasks, **Then** the facilitator can accept, edit,
   or reject each proposal before any new template tasks are added to the plan.

---

### User Story 3 - Enrol Hires and Generate Reviewable Journeys (Priority: P1)

As a facilitator, I need to enrol a hire into a published plan, automatically
create their account, and generate a reviewable draft journey so onboarding can
begin without spreadsheet-based setup.

**Why this priority**: JourneyPoint must convert reusable plans into real
hire-specific journeys before anyone can experience the product's value.

**Independent Test**: This story is independently valuable if a facilitator can
create a hire, generate a draft journey from a published plan, review the copied
tasks and due dates, and activate the journey for the new hire.

**Acceptance Scenarios**:

1. **Given** a facilitator submits a hire enrolment form with a published plan,
   **When** the enrolment succeeds, **Then** the system creates the hire record,
   creates a platform account, and generates a draft journey with due dates.
2. **Given** a generated journey draft, **When** the facilitator edits task
   details before activation, **Then** the draft reflects those edits without
   mutating the underlying plan template.
3. **Given** a facilitator activates the journey, **When** the hire signs in,
   **Then** the hire can view only their active journey and not draft journeys
   or other hires' content.

---

### User Story 4 - Guide Participants with Human-in-the-Loop AI (Priority: P2)

As a facilitator, manager, or enrolee, I need role-specific journey execution
workspaces and optional AI-supported personalisation that remains fully
reviewable so onboarding feels guided, contextual, and accountable.

**Why this priority**: This story delivers the human experience of the product:
participants complete tasks, managers fulfill check-ins, and facilitators refine
journeys without surrendering control to AI.

**Independent Test**: This story is independently valuable if an enrolee can
complete tasks, a manager can complete manager-assigned tasks, and a facilitator
can request AI personalisation, review a per-task diff, and accept only the
changes they trust.

**Acceptance Scenarios**:

1. **Given** an active journey, **When** an enrolee opens their dashboard,
   **Then** tasks appear grouped by module with statuses, due dates, and any
   personalisation indicators.
2. **Given** manager-assigned tasks exist, **When** a manager opens their work
   view, **Then** they see only their direct reports' manager tasks and can mark
   them complete.
3. **Given** a facilitator explicitly requests AI personalisation, **When** the
   AI returns revised content, **Then** the system shows a diff, allows
   per-change approval, and records an audit log of the interaction.

---

### User Story 5 - Monitor Engagement and Intervene Early (Priority: P2)

As a facilitator, I need engagement scoring, an at-risk signal, a pipeline
board, and intervention history so I can spot struggling hires early and take
documented action before onboarding fails.

**Why this priority**: JourneyPoint's differentiator is not only plan delivery;
it is the ability to convert progress signals into timely facilitator action.

**Independent Test**: This story is independently valuable if opening the
pipeline or hire profile computes fresh engagement data, updates score history,
surfaces at-risk flags, and lets a facilitator capture intervention actions.

**Acceptance Scenarios**:

1. **Given** a hire's task state changes, **When** a facilitator opens the
   pipeline or hire profile, **Then** the system computes the latest engagement
   score and stores a new historical snapshot.
2. **Given** a hire falls below the at-risk threshold, **When** engagement is
   computed, **Then** the system raises an active at-risk flag if one does not
   already exist.
3. **Given** a facilitator reviews an at-risk hire, **When** they acknowledge or
   resolve the flag, **Then** the intervention history remains visible on the
   hire profile and the pipeline reflects the current state.

### Edge Cases

- A facilitator imports markdown with missing or ambiguous column headings.
- A document upload succeeds but text extraction yields no usable tasks.
- AI extraction or personalisation returns malformed or partial output.
- Welcome email delivery fails after hire account creation succeeds.
- A facilitator edits plan tasks after some hires already have generated
  journeys.
- A manager has no direct reports or no currently assigned tasks.
- A hire has no completed activity yet, making recency-based scoring ambiguous.
- A tenant attempts to access another tenant's seeded demo data or cached route.
- A facilitator reopens a hire profile repeatedly, causing multiple engagement
  computations in a short period.
- All tasks in a journey are complete, requiring the hire to appear in the final
  pipeline column instead of a module column.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide authenticated, role-aware access for
  TenantAdmin, Facilitator, Manager, and Enrolee users.
- **FR-002**: The system MUST preserve tenant isolation across plans, hires,
  journeys, flags, analytics, and seed data.
- **FR-003**: Facilitators MUST be able to create, edit, reorder, publish,
  archive, and clone onboarding plans.
- **FR-004**: Facilitators MUST be able to create and maintain ordered modules
  within each onboarding plan.
- **FR-005**: Facilitators MUST be able to create and maintain template tasks
  within modules, including due-day offsets, assignment targets, and
  acknowledgement requirements.
- **FR-006**: The system MUST allow facilitators to import a draft onboarding
  plan from structured markdown content.
- **FR-007**: The markdown import flow MUST preview detected modules and tasks
  before saving a new draft plan.
- **FR-008**: The system MUST allow facilitators to upload a PDF or markdown
  document to an existing published plan for enrichment.
- **FR-009**: The system MUST track uploaded document metadata, extraction
  status, and counts of proposed and accepted tasks.
- **FR-010**: The system MUST convert extracted document content into
  reviewable task proposals instead of applying them automatically.
- **FR-011**: Facilitators MUST be able to accept, edit, reject, and assign
  extracted task proposals before they become plan tasks.
- **FR-012**: Accepted extracted tasks MUST affect future journeys only and MUST
  NOT retroactively mutate already generated journeys.
- **FR-013**: Facilitators MUST be able to create a hire with identity details,
  start date, plan selection, and optional manager assignment.
- **FR-014**: The system MUST create a platform account for each enrolled hire
  and associate it with the Enrolee role.
- **FR-015**: The system MUST send hire credentials through a welcome-notification
  workflow or retain recoverable state if delivery fails.
- **FR-016**: The system MUST synchronously generate a draft journey from the
  selected published plan during enrolment.
- **FR-017**: Generated journey tasks MUST preserve source plan ordering,
  assignment targets, acknowledgement rules, and due dates based on the hire's
  start date.
- **FR-018**: Facilitators MUST be able to review and adjust generated journey
  tasks before journey activation without changing the underlying plan template.
- **FR-019**: Facilitators MUST be able to add or remove pending journey tasks
  during review before activation.
- **FR-020**: The system MUST require an explicit facilitator action before any
  journey-level AI personalisation occurs.
- **FR-021**: AI personalisation MUST return reviewable changes that can be
  accepted or rejected per task.
- **FR-022**: The system MUST retain an audit log for each AI request, including
  outcome status and revision summary.
- **FR-023**: Enrolees MUST be able to view only their active journey, grouped
  by module, with task status, due-date, and personalisation visibility.
- **FR-024**: Enrolees MUST be able to complete their assigned tasks, with
  acknowledgement gating when required.
- **FR-025**: Managers MUST be able to view and complete only tasks assigned to
  them for their direct reports.
- **FR-026**: The system MUST compute an engagement score whenever a facilitator
  opens the pipeline or an individual hire profile.
- **FR-027**: Each engagement computation MUST append a new historical snapshot
  rather than overwrite prior score history.
- **FR-028**: The system MUST automatically raise an active at-risk flag when a
  hire's engagement classification falls below the defined threshold.
- **FR-029**: The system MUST automatically resolve an active at-risk flag when
  the hire returns to the healthy classification range.
- **FR-030**: Facilitators MUST be able to acknowledge, annotate, and manually
  resolve at-risk flags while preserving the intervention history.
- **FR-031**: The system MUST present a pipeline board whose columns are derived
  from onboarding modules plus a final completion column.
- **FR-032**: Pipeline cards MUST display hire identity, progress state,
  engagement classification, and at-risk visibility in one glance.
- **FR-033**: Facilitators MUST be able to filter the pipeline by engagement
  classification and drill into hire detail views.
- **FR-034**: Hire detail views MUST show recent engagement history suitable for
  a trend chart and intervention review.
- **FR-035**: The system MUST support a demo-ready seed state containing at
  least two distinct tenants and hires across multiple engagement bands.

### Key Entities *(include if feature involves data)*

- **OnboardingPlan**: A reusable onboarding curriculum with metadata, lifecycle
  state, target audience, modules, and linked enrichment documents.
- **OnboardingModule**: An ordered phase within an onboarding plan that groups
  related template tasks and defines the journey sequence.
- **OnboardingTask**: A reusable template task inside a module with timing,
  assignee, category, and acknowledgement rules.
- **OnboardingDocument**: An uploaded plan-level enrichment document whose
  extraction lifecycle and proposal counts are tracked.
- **ExtractedTask**: An AI-proposed task candidate created from an enrichment
  document and reviewed by a facilitator before adoption.
- **Hire**: A tenant-scoped new-hire record linked to an identity, manager,
  onboarding plan, and lifecycle state.
- **Journey**: The hire-specific copy of a published onboarding plan with its
  own draft, active, paused, or completed lifecycle.
- **JourneyTask**: A concrete actionable task inside a journey, optionally linked
  to a template source task and carrying due-date and completion state.
- **GenerationLog**: An audit record for each AI extraction or personalisation
  interaction.
- **EngagementSnapshot**: An append-only historical record of engagement metrics
  and classification at a point in time.
- **AtRiskFlag**: A facilitator-facing intervention record that tracks when a
  hire became at risk, who acknowledged the flag, and how it was resolved.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A facilitator can create and publish a reusable onboarding plan
  with at least 20 tasks in under 15 minutes, either manually or via markdown
  import and review.
- **SC-002**: Enrolling a hire into a published plan produces a reviewable draft
  journey with correctly ordered tasks in under 60 seconds for the standard demo
  plan size.
- **SC-003**: A facilitator can request, review, and selectively accept AI
  personalisation changes without losing traceability of the original task
  content.
- **SC-004**: Enrolees and managers can complete their own assigned tasks and
  see those updates reflected on the next dashboard or pipeline load with no
  spreadsheet or manual sync step.
- **SC-005**: Opening the pipeline or a hire profile automatically surfaces
  currently at-risk hires based on stored task activity, with no manual scoring
  process.
- **SC-006**: A facilitator can identify the current journey stage and
  engagement state of every active hire in a demo cohort within two minutes from
  the pipeline board.
- **SC-007**: Two tenants can be demonstrated in the same deployment without any
  cross-tenant visibility of plans, hires, journeys, flags, or analytics.
- **SC-008**: A seeded demo environment can show one engaged, one
  needs-attention, and one at-risk hire immediately after setup so reviewers can
  validate the full product loop on first run.

## Assumptions

- JourneyPoint v1 uses fixed reusable plans; it does not generate fully custom
  journeys from scratch per hire.
- AI personalisation revises existing journey tasks and does not autonomously
  add or remove tasks during the activation review flow.
- Welcome email is the only required notification in the current scope; due-task
  reminders and at-risk alert emails can remain future enhancements.
- Local filesystem document storage is acceptable for the current milestone set
  as long as the storage mechanism remains abstractable later.
- Engagement scoring is on-demand for the current scope and does not require a
  background scheduler before the final milestone.
- The Angular application is legacy reference material only and is out of scope
  for the current JourneyPoint roadmap.
