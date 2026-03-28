# Data Model: JourneyPoint Intelligent Onboarding Platform

## Domain Overview

JourneyPoint has three primary domain areas:

1. Plan authoring and enrichment
2. Journey enrolment and execution
3. Engagement intelligence and intervention

## Entity Implementation Contract

- New JourneyPoint product entities should default to `FullAuditedEntity<Guid>`
  unless the active spec explicitly records another key strategy.
- Property validation should prefer data annotations such as `[Required]`,
  `[MaxLength]`, `[Range]`, and `[ForeignKey]`.
- Aggregate and cross-entity rules should live in Core domain managers/services
  rather than entity method bodies.
- EF-specific concerns such as table naming, enum conversion, and composite
  uniqueness belong in `JourneyPoint.EntityFrameworkCore`.
- The same contract applies to future entities in the onboarding, hires,
  engagement, and audit domains unless a later approved spec amendment records
  a narrower exception.

## Entity Inventory

| Entity | Purpose | Key Relationships |
|--------|---------|-------------------|
| OnboardingPlan | Reusable onboarding curriculum | Has many modules and documents |
| OnboardingModule | Ordered phase in a plan | Belongs to a plan; has many template tasks |
| OnboardingTask | Reusable template task | Belongs to a module; may be copied into journey tasks |
| OnboardingDocument | Uploaded enrichment source | Belongs to a plan; has many extracted tasks |
| ExtractedTask | Reviewable AI task proposal | Belongs to an onboarding document |
| Hire | Tenant-scoped new hire record | Belongs to a plan; has one journey |
| Journey | Hire-specific onboarding instance | Belongs to a hire and a plan; has many journey tasks |
| JourneyTask | Concrete actionable journey task | Belongs to a journey; may reference a source template task |
| GenerationLog | AI audit record | Belongs to a hire and/or journey |
| EngagementSnapshot | Historical engagement state | Belongs to a hire and journey |
| AtRiskFlag | Intervention workflow record | Belongs to a hire |

## Plan Authoring and Enrichment

### OnboardingPlan

- Lifecycle: Draft -> Published -> Archived
- Core fields: name, description, target audience, duration days, status
- Relationships:
  - one-to-many with `OnboardingModule`
  - one-to-many with `OnboardingDocument`

### OnboardingModule

- Purpose: define ordered phases that also drive pipeline columns
- Core fields: onboarding plan id, name, description, order index
- Relationships:
  - many-to-one with `OnboardingPlan`
  - one-to-many with `OnboardingTask`

### OnboardingTask

- Purpose: define reusable template work before a hire exists
- Core fields: module id, title, description, category, order index, due-day
  offset, assigned-to role, acknowledgement requirement
- Relationships:
  - many-to-one with `OnboardingModule`
  - optional one-to-many source relationship to `JourneyTask`

### OnboardingDocument

- Purpose: track uploaded markdown, text, PDF, or image enrichment content for
  saved plans
- Core fields: plan id, file name, storage path, file type, extraction status,
  extracted task count, accepted task count
- Relationships:
  - many-to-one with `OnboardingPlan`
  - one-to-many with `ExtractedTask`

### ExtractedTask

- Purpose: hold AI-proposed tasks until facilitator review
- Core fields: onboarding document id, title, description, category, suggested
  day offset, suggested module id, review status, reviewed-by user id
- Relationships:
  - many-to-one with `OnboardingDocument`
  - optional facilitator-selected module reference prior to acceptance

## Journey Enrolment and Execution

### Hire

- Lifecycle: PendingActivation -> Active -> Completed or Exited
- Core fields:
  - tenant id
  - onboarding plan id
  - platform user id
  - manager user id
  - full name
  - email address
  - role title
  - department
  - start date
  - status
  - activated at
  - completed at
  - exited at
- Validation:
  - full name and email are required
  - start date is required
  - onboarding plan id is required
  - role title and department use bounded lengths
  - a tenant-scoped hire cannot point at a plan from another tenant
- Relationships:
  - many-to-one with `OnboardingPlan`
  - one-to-one with `Journey`

### Journey

- Lifecycle: Draft -> Active -> Paused -> Completed
- Core fields:
  - tenant id
  - hire id
  - onboarding plan id
  - status
  - activated at
  - paused at
  - completed at
- Validation:
  - only one journey exists per hire in the initial M3 slice
  - a draft journey can be edited and activated
  - only a published onboarding plan can generate a journey draft
  - a journey can activate only when it has at least one task
- Relationships:
  - one-to-one with `Hire`
  - many-to-one with `OnboardingPlan`
  - one-to-many with `JourneyTask`
  - one-to-many with `GenerationLog`
  - one-to-many with `EngagementSnapshot`

### JourneyTask

- Lifecycle: Pending -> Completed, with overdue derived from `DueOn`
- Core fields:
  - tenant id
  - journey id
  - optional source onboarding task id
  - optional source onboarding module id
  - module title snapshot
  - module order index snapshot
  - task order index snapshot
  - title snapshot
  - description snapshot
  - category snapshot
  - assignment target snapshot
  - acknowledgement rule snapshot
  - due day offset snapshot
  - due on
  - status
  - acknowledged at
  - completed at
  - completed by user id
- Validation:
  - task order must be unique within a journey module snapshot
  - due day offset cannot be negative
  - due date must not be earlier than the hire start date
  - source references are optional and never used as live reads after
    generation
- Relationships:
  - many-to-one with `Journey`
  - optional many-to-one with `OnboardingTask`

### Minimal Domain File Set for JP-013

- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/Hire.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/HireLifecycleState.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/Journey.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/JourneyStatus.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/JourneyTask.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/JourneyTaskStatus.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/HireJourneyManager.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/HireJourneyManager.Validation.cs`

### JP-013 Validation Steps

1. Create a hire for a published plan and confirm the new hire starts in
   `PendingActivation` while the linked journey starts in `Draft`.
2. Generate journey tasks and confirm each task stores copied snapshot content
   plus optional `SourceOnboardingTaskId` linkage.
3. Edit the plan template after generation and confirm the draft journey task
   content does not change.
4. Activate the journey and confirm the hire moves to `Active`, the journey
   moves to `Active`, and copied due dates remain based on the hire start date.
5. Pause or complete the journey through the manager logic and confirm
   transitions reject invalid state jumps.

### GenerationLog

- Purpose: audit every AI personalisation or extraction workflow
- Core fields: journey id, hire id, prompt summary, raw response summary, tasks
  revised, tasks added, duration, status
- Relationships:
  - many-to-one with `Journey`
  - many-to-one with `Hire`

## Engagement Intelligence and Intervention

### EngagementSnapshot

- Purpose: append-only history for scores and trend chart rendering
- Core fields: hire id, journey id, completion rate, days since last activity,
  overdue count, composite score, classification, computed at
- Relationships:
  - many-to-one with `Hire`
  - many-to-one with `Journey`

### AtRiskFlag

- Purpose: facilitator intervention record for disengaged hires
- Core fields: hire id, raised at, classification at raise, acknowledged by
  user id, acknowledged at, intervention notes, resolved at, resolution type
- Relationships:
  - many-to-one with `Hire`

## Derived Rules

- A hire can have only one journey aggregate in the initial milestone-3 slice.
- A hire cannot become `Active` until its journey has been explicitly activated.
- A hire can have at most one unresolved at-risk flag at a time.
- Journey tasks inherit their initial ordering, module grouping, and due-date
  logic from template tasks at generation time.
- Journey tasks retain copied snapshots even if the source onboarding plan is
  later edited, published again, or enriched with new tasks.
- Accepted extracted tasks affect future journeys only.
- AI personalisation updates journey tasks only after facilitator approval.
- Engagement snapshots are append-only and never overwritten.
