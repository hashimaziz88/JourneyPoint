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
  - welcome notification status
  - welcome notification last attempted at
  - welcome notification sent at
  - welcome notification failure reason
- Validation:
  - full name and email are required
  - start date is required
  - onboarding plan id is required
  - role title and department use bounded lengths
  - a tenant-scoped hire cannot point at a plan from another tenant
  - optional `ManagerUserId` must reference a same-tenant user with the
    `Manager` role
  - `PlatformUserId` becomes required once account provisioning succeeds
  - recoverable welcome failure state may store a safe failure summary only and
    must never store plaintext credentials
- Relationships:
  - many-to-one with `OnboardingPlan`
  - one-to-one with `Journey`

### WelcomeNotificationStatus

- Lifecycle: Pending -> Sent or FailedRecoverable
- Purpose: track the outcome of the initial welcome-notification attempt without
  introducing a separate communication aggregate in JP-015
- Core fields:
  - status
  - last attempted at
  - sent at
  - failure reason summary
- Notes:
  - plaintext credentials are never persisted
  - JP-018 may add retry/resend orchestration on top of this state

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
  - personalised at
- Validation:
  - task order must be unique within a journey module snapshot
  - due day offset cannot be negative
  - due date must not be earlier than the hire start date
  - source references are optional and never used as live reads after
    generation
  - facilitators may edit snapshot fields only while the journey is in `Draft`
  - facilitator-authored draft tasks must keep null source-template ids
  - pending draft tasks may be removed during review, but template tasks are
    never deleted or rewritten as part of review
  - `PersonalisedAt` is null until facilitator-approved AI revisions are
    applied to that task and is not set for ordinary manual draft edits
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

### JP-015 Planned Application Files

- `aspnet-core/src/JourneyPoint.Application/Services/HireService/IHireAppService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/HireService/HireAppService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/HireService/Dto/CreateHireRequest.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/HireService/Dto/HireEnrolmentResultDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/NotificationService/IWelcomeNotificationService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/NotificationService/WelcomeNotificationService.cs`

### JP-015 Validation Steps

1. Submit hire creation for a published plan and confirm a same-tenant `Hire`
   is created in `PendingActivation` with no cross-tenant plan or manager
   leakage.
2. Confirm a tenant-scoped platform account is created for the hire and
   assigned only the `Enrolee` role.
3. Supply an optional manager id and confirm enrolment accepts only a same-tenant
   user who already has the `Manager` role.
4. Run enrolment with mail enabled and confirm the response reports welcome
   status `Sent` with a recorded send timestamp.
5. Simulate a notification failure and confirm the hire and account still
   persist while the hire records `FailedRecoverable` plus safe failure metadata
   only, with no plaintext credential storage.

### JP-016 Planned Application Files

- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/IJourneyAppService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/JourneyAppService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/JourneyAppService.Support.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/GenerateDraftJourneyRequest.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/JourneyDraftDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/JourneyTaskReviewDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/UpdateJourneyTaskRequest.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/AddJourneyTaskRequest.cs`

### JP-016 Validation Steps

1. Generate a draft journey for a same-tenant hire enrolled against a published
   plan and confirm the response completes synchronously with copied journey
   tasks.
2. Confirm generated tasks preserve module ordering, task ordering, assignment
   targets, acknowledgement rules, and optional source-template ids from the
   published plan.
3. Confirm every generated `DueOn` value equals `Hire.StartDate` plus the
   copied `DueDayOffset`.
4. Edit one generated draft task and confirm only the `JourneyTask` snapshot
   changes while the source onboarding plan/task records remain unchanged.
5. Add one facilitator-authored draft task and confirm it persists with null
   source-template ids and valid draft ordering.
6. Remove one pending draft task and confirm activation rules still evaluate
   against the updated journey task set without mutating the template.

### JP-017 Planned Frontend Files

- `journeypoint/app/(facilitator)/facilitator/hires/page.tsx`
- `journeypoint/app/(facilitator)/facilitator/hires/[hireId]/page.tsx`
- `journeypoint/app/(facilitator)/facilitator/hires/[hireId]/journey/page.tsx`
- `journeypoint/providers/hireProvider/actions.tsx`
- `journeypoint/providers/hireProvider/context.tsx`
- `journeypoint/providers/hireProvider/index.tsx`
- `journeypoint/providers/hireProvider/reducer.tsx`
- `journeypoint/providers/journeyProvider/actions.tsx`
- `journeypoint/providers/journeyProvider/context.tsx`
- `journeypoint/providers/journeyProvider/index.tsx`
- `journeypoint/providers/journeyProvider/reducer.tsx`
- `journeypoint/components/hires/HireListView.tsx`
- `journeypoint/components/hires/HireDetailView.tsx`
- `journeypoint/components/journey/JourneyReviewView.tsx`
- `journeypoint/components/hires/style/style.ts`
- `journeypoint/components/journey/style/style.ts`
- `journeypoint/types/hire/index.ts`
- `journeypoint/types/journey/index.ts`
- `journeypoint/constants/hire/list.ts`
- `journeypoint/constants/journey/review.ts`
- `journeypoint/utils/hire/list.ts`
- `journeypoint/utils/journey/review.ts`
- `journeypoint/constants/auth/routes.ts`

### JP-017 Validation Steps

1. Open the facilitator hire list page and confirm it loads same-tenant hires
   with lifecycle and welcome-notification summaries through `hireProvider`.
2. Filter or refresh the hire list and confirm provider-backed query state
   updates the rendered list without route mismatches or inline style usage.
3. Open one hire detail page and confirm it shows hire identity, plan linkage,
   manager association, account/welcome status, and current journey summary.
4. Navigate from the hire detail page to the journey review page and confirm the
   route loads draft task snapshots through `journeyProvider`.
5. Update one draft task, add one facilitator-authored task, and remove one
   pending draft task from the review page while confirming the UI rehydrates
   from backend responses instead of mutating template state locally.
6. Activate the draft journey from the review page and confirm the provider
   refreshes to show the activated journey state and disables draft-only review
   controls.

### GenerationLog

- Purpose: audit every AI personalisation or extraction workflow
- Core fields:
  - workflow type
  - status
  - hire id
  - journey id
  - onboarding plan id
  - onboarding document id
  - model name
  - prompt summary
  - response summary
  - failure reason
  - tasks revised
  - tasks added
  - started at
  - completed at
  - duration milliseconds
- Relationships:
  - many-to-one with `Journey`
  - many-to-one with `Hire`
  - many-to-one with `OnboardingPlan`
  - many-to-one with `OnboardingDocument`

### JourneyPersonalisationProposal (Transient Application Contract)

- Purpose: represent one facilitator-reviewed AI personalisation preview before
  any change is applied to the journey
- Core fields:
  - generation log id
  - hire id
  - journey id
  - model name
  - requested at
  - summary
  - revised task count
  - task diffs
- Validation:
  - generated only for a same-tenant journey in `Draft` or `Active`
  - includes only tasks that remain eligible for revision at request time
  - is transient for JP-020 and is not persisted as a separate aggregate
  - proposal payloads may revise existing task snapshots only and may not add
    or remove tasks
- Relationships:
  - one-to-one with one `GenerationLog` for the originating AI run
  - many-to-one with `Journey`
  - many-to-one with `Hire`

### JourneyTaskPersonalisationDiff (Transient Application Contract)

- Purpose: carry one diff-ready proposed revision for one existing journey task
- Core fields:
  - journey task id
  - baseline snapshot timestamp
  - current snapshot fields
  - proposed snapshot fields
  - revision rationale
  - changed field list
- Validation:
  - `JourneyTaskId` must resolve to an existing same-tenant task on the target
    journey
  - completed tasks are not eligible for personalisation diffs
  - unsupported fields, duplicate task ids, and add/remove semantics are
    rejected during parsing
  - apply requests must fail if the current task no longer matches the reviewed
    baseline timestamp

### JP-020 Planned Application Files

- `aspnet-core/src/JourneyPoint.Application/Services/GroqService/IGroqJourneyPersonalisationService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/GroqService/GroqJourneyPersonalisationService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/GroqService/GroqJourneyPersonalisationPromptFactory.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/GroqService/GroqJourneyPersonalisationContracts.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/GroqService/GroqJourneyPersonalisationMapper.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/JourneyAppService.Personalisation.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/RequestJourneyPersonalisationRequest.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/JourneyPersonalisationProposalDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/JourneyTaskPersonalisationDiffDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/ApplyJourneyPersonalisationRequest.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/ApplyJourneyPersonalisationSelectionDto.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/HireJourneyManager.Personalisation.cs`

### JP-020 Validation Steps

1. Request personalisation for a same-tenant journey in `Draft` or `Active`
   and confirm the backend returns a diff-ready proposal without mutating any
   `JourneyTask` records yet.
2. Confirm the proposal payload includes only eligible pending tasks and that
   each diff references an existing `JourneyTaskId` plus a baseline snapshot
   timestamp from the reviewed task state.
3. Simulate malformed or out-of-scope model output and confirm unsupported
   fields, duplicate task ids, and add/remove semantics are rejected rather than
   silently applied.
4. Apply only a subset of the returned diffs and confirm the selected task
   snapshots change while unselected tasks remain unchanged.
5. Edit one task after requesting personalisation and then try to apply the old
   diff; confirm the request is rejected as stale and requires a fresh
   personalisation run.
6. Confirm the personalisation request writes one `GenerationLog` row with
   workflow type `Personalisation`, timing metadata, status, and proposed
   revision counts.

### EnroleeJourneyDashboard (Transient Application Contract)

- Purpose: return the active journey workspace for the signed-in enrolee
- Core fields:
  - journey id
  - hire id
  - journey status
  - activated at
  - total task count
  - completed task count
  - overdue task count
  - module groups
- Validation:
  - resolves only the signed-in enrolee's same-tenant active journey
  - excludes facilitator draft-review metadata and source-template ids
  - groups tasks by copied module snapshot title and order
- Relationships:
  - one-to-one with one `Journey`
  - one-to-many with `EnroleeJourneyModuleGroup`

### EnroleeJourneyModuleGroup (Transient Application Contract)

- Purpose: present one dashboard module section with progress totals
- Core fields:
  - module key
  - module title
  - module order index
  - total task count
  - completed task count
  - pending task count
  - task list items
- Validation:
  - groups are ordered by copied `ModuleOrderIndex`
  - task list items inside a group are ordered by copied `TaskOrderIndex`

### EnroleeJourneyTaskListItem (Transient Application Contract)

- Purpose: carry dashboard-ready task summary data for one participant-owned
  task card or list row
- Core fields:
  - journey task id
  - title
  - short description preview
  - due on
  - status
  - acknowledgement rule
  - acknowledged at
  - assignment target
  - is overdue
  - is personalised
- Validation:
  - list items are returned only for enrolee-assigned tasks in the current
    enrolee's active journey
  - `IsPersonalised` derives from persisted task metadata rather than transient
    AI proposal state

### EnroleeJourneyTaskDetail (Transient Application Contract)

- Purpose: power the dedicated enrolee task-detail page and action controls
- Core fields:
  - journey task id
  - journey id
  - module title
  - module order index
  - task order index
  - title
  - description
  - due on
  - status
  - acknowledgement rule
  - acknowledged at
  - completed at
  - is personalised
  - personalised at
  - can acknowledge
  - can complete
- Validation:
  - resolves only one same-tenant active enrolee task owned by the signed-in
    participant
  - completion is disabled until acknowledgement is recorded when the task rule
    requires it
  - completed tasks remain readable but cannot be completed again

### JP-021 Planned Application and Frontend Files

- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/IJourneyAppService.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/JourneyAppService.Participant.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/EnroleeJourneyDashboardDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/EnroleeJourneyModuleGroupDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/EnroleeJourneyTaskListItemDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/EnroleeJourneyTaskDetailDto.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/AcknowledgeJourneyTaskRequest.cs`
- `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/Dto/CompleteJourneyTaskRequest.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Hires/HireJourneyManager.Participant.cs`
- `journeypoint/app/(enrolee)/enrolee/my-journey/page.tsx`
- `journeypoint/app/(enrolee)/enrolee/my-journey/tasks/[taskId]/page.tsx`
- `journeypoint/providers/journeyProvider/actions.tsx`
- `journeypoint/providers/journeyProvider/context.tsx`
- `journeypoint/providers/journeyProvider/index.tsx`
- `journeypoint/providers/journeyProvider/reducer.tsx`
- `journeypoint/components/journey/EnroleeJourneyDashboardView.tsx`
- `journeypoint/components/journey/EnroleeJourneyModuleSection.tsx`
- `journeypoint/components/journey/JourneyTaskDetailView.tsx`
- `journeypoint/components/journey/JourneyTaskAcknowledgementPanel.tsx`
- `journeypoint/components/journey/style/style.ts`
- `journeypoint/types/journey/index.ts`
- `journeypoint/types/journey/components.ts`
- `journeypoint/constants/journey/dashboard.ts`
- `journeypoint/constants/auth/routes.ts`
- `journeypoint/utils/journey/dashboard.ts`

### JP-021 Validation Steps

1. Sign in as an enrolee with an active same-tenant journey and confirm the
   dashboard route loads only that journey grouped by copied module snapshots.
2. Confirm dashboard task rows show status, due date, acknowledgement state,
   and participant-visible personalisation indicators without exposing
   facilitator draft metadata.
3. Open one enrolee-assigned task detail page and confirm the full description,
   due date, acknowledgement requirement, and personalised indicator render from
   provider-backed state.
4. Attempt to complete a task that requires acknowledgement and confirm the UI
   blocks completion until acknowledgement succeeds through the backend action.
5. Acknowledge and then complete an eligible task, and confirm both the detail
   view and dashboard progress counters refresh from backend responses.
6. Attempt direct access to another enrolee's task or a manager-assigned task
   and confirm the backend rejects the request rather than leaking task data.
7. Apply AI personalisation to a pending task, reload the enrolee dashboard,
   and confirm the personalised indicator persists from durable task metadata.

### FacilitatorJourneyPersonalisationReviewState (Transient Frontend Contract)

- Purpose: hold one facilitator-reviewed AI personalisation proposal alongside
  the existing journey review workspace
- Core fields:
  - generation log id
  - journey id
  - requested at
  - summary
  - per-task diff items
  - selected journey task ids
  - rejected journey task ids or equivalent explicit selection state
  - applyable accepted count
- Validation:
  - proposal state is transient and lives only in typed provider state during a
    facilitator review session
  - selections default to unreviewed or not accepted until the facilitator
    explicitly accepts a task diff
  - rejected or untouched diffs must not be included in the apply request
  - clearing the review or successfully applying accepted diffs drops the local
    proposal state and reloads the authoritative backend journey snapshot

### FacilitatorJourneyTaskDiffReview (Transient Frontend Contract)

- Purpose: represent one facilitator-visible before/after review card for an AI
  task revision
- Core fields:
  - journey task id
  - module title
  - task order index
  - baseline snapshot timestamp
  - changed field list
  - current field values
  - proposed field values
  - rationale
  - acceptance status
- Validation:
  - cards are derived directly from `JourneyTaskPersonalisationDiffDto`
  - only diffs with at least one changed field should render in the review list
  - acceptance state is UI-only until the facilitator invokes apply

### JP-023 Planned Frontend Files

- `journeypoint/app/(facilitator)/facilitator/hires/[hireId]/journey/page.tsx`
- `journeypoint/components/journey/JourneyReviewView.tsx`
- `journeypoint/components/journey/PersonalisationDiff.tsx`
- `journeypoint/components/journey/PersonalisationDiffCard.tsx`
- `journeypoint/providers/journeyProvider/actions.tsx`
- `journeypoint/providers/journeyProvider/context.tsx`
- `journeypoint/providers/journeyProvider/index.tsx`
- `journeypoint/providers/journeyProvider/reducer.tsx`
- `journeypoint/components/journey/style/style.ts`
- `journeypoint/types/journey/index.ts`
- `journeypoint/types/journey/components.ts`
- `journeypoint/constants/journey/personalisation.ts`
- `journeypoint/utils/journey/personalisation.ts`

### JP-023 Validation Steps

1. Open the facilitator journey review route for a same-tenant draft or active
   journey and request AI personalisation.
2. Confirm the page renders one proposal summary plus per-task before/after
   diff cards with changed-field cues and rationale instead of raw JSON.
3. Accept some task diffs, reject others, and confirm the apply action counts
   only the accepted selections.
4. Apply the accepted subset and confirm only those pending journey tasks
   change while rejected or untouched diffs do not.
5. Confirm the proposal state clears or refreshes after apply so the screen
   reflects the authoritative backend draft rather than stale selections.
6. Trigger a request that returns no valid diffs or a backend error and confirm
   the UI surfaces a clear empty or failure state without breaking the existing
   draft-review workflow.

## Engagement Intelligence and Intervention

### EngagementSnapshot

- Purpose: append-only engagement history for scoring, trend charts, and
  facilitator intelligence views
- Core fields:
  - tenant id
  - hire id
  - journey id
  - completion rate
  - days since last activity
  - overdue task count
  - composite score
  - classification
  - computed at
- Validation:
  - every snapshot belongs to the same tenant as the referenced hire and
    journey
  - snapshots are append-only and are never updated in place to represent a
    later computation
  - `ComputedAt` reflects the time of the scoring run and is required
  - `CompositeScore` must stay within the scoring range defined by the later
    engagement service
  - a snapshot may be recorded only for an existing hire and its linked journey
- Relationships:
  - many-to-one with `Hire`
  - many-to-one with `Journey`

### AtRiskFlag

- Lifecycle: Active -> Acknowledged -> Resolved
- Purpose: durable facilitator intervention record for disengaged hires
- Core fields:
  - tenant id
  - hire id
  - journey id
  - raised at
  - classification at raise
  - current status
  - acknowledged by user id
  - acknowledged at
  - acknowledgement notes
  - resolved by user id
  - resolved at
  - resolution type
  - resolution notes
- Validation:
  - every flag belongs to the same tenant as the referenced hire and journey
  - only one unresolved flag may exist per hire at a time in the initial M5
    slice
  - acknowledgement fields remain null until a facilitator explicitly
    acknowledges the active flag
  - resolution fields remain null until the flag is resolved manually or
    automatically
  - resolving a flag preserves the record and must not delete or overwrite the
    original raised-at context
- Relationships:
  - many-to-one with `Hire`
  - many-to-one with `Journey`

### AtRiskFlagStatus

- Lifecycle: Active -> Acknowledged -> Resolved
- Purpose: distinguish an unresolved risk signal from one that has been seen by
  a facilitator and one that has been fully resolved

### AtRiskResolutionType

- Purpose: classify how an at-risk episode ended, such as manual facilitator
  resolution or automatic recovery after the hire returned to a healthy score

### JP-025 Planned Domain Files

- `aspnet-core/src/JourneyPoint.Core/Domains/Engagement/EngagementSnapshot.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Engagement/AtRiskFlag.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Engagement/AtRiskFlagStatus.cs`
- `aspnet-core/src/JourneyPoint.Core/Domains/Engagement/AtRiskResolutionType.cs`

### JP-025 Validation Steps

1. Create two engagement snapshots for the same hire and journey and confirm
   both rows persist in chronological history rather than overwriting the prior
   computation.
2. Confirm every snapshot and at-risk flag record carries the same tenant
   ownership as the referenced hire and journey.
3. Raise an at-risk flag for a hire and confirm a second unresolved flag cannot
   be created until the first one has been resolved.
4. Acknowledge an active flag and confirm acknowledgement metadata is recorded
   without resolving the intervention.
5. Resolve the flag and confirm the record keeps its original raised-at and
   acknowledgement context while adding resolution metadata.

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
