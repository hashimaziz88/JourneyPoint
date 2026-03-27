# Data Model: JourneyPoint Intelligent Onboarding Platform

## Domain Overview

JourneyPoint has three primary domain areas:

1. Plan authoring and enrichment
2. Journey enrolment and execution
3. Engagement intelligence and intervention

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

- Purpose: track uploaded markdown or PDF enrichment content
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

- Lifecycle: Active -> Completed or Exited
- Core fields: full name, email, role title, department, start date, manager
  user id, onboarding plan id, platform user id, status
- Relationships:
  - many-to-one with `OnboardingPlan`
  - one-to-one with `Journey`

### Journey

- Lifecycle: Draft -> Active -> Paused -> Completed
- Core fields: hire id, onboarding plan id, status, personalised at, activated
  at, completed at
- Relationships:
  - one-to-one with `Hire`
  - many-to-one with `OnboardingPlan`
  - one-to-many with `JourneyTask`
  - one-to-many with `GenerationLog`
  - one-to-many with `EngagementSnapshot`

### JourneyTask

- Lifecycle: Pending -> Complete or Overdue
- Core fields: journey id, source task id, title, description, category,
  assigned-to role, due date, completed at, acknowledged at, personalised flag
- Relationships:
  - many-to-one with `Journey`
  - optional many-to-one with `OnboardingTask`

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

- A hire can have only one active journey at a time.
- A hire can have at most one unresolved at-risk flag at a time.
- Journey tasks inherit their initial ordering and due-date logic from template
  tasks at generation time.
- Accepted extracted tasks affect future journeys only.
- AI personalisation updates journey tasks only after facilitator approval.
- Engagement snapshots are append-only and never overwritten.
