# Research: JourneyPoint Intelligent Onboarding Platform

## Decision 1: Keep the existing ABP API-only backend and Next.js frontend split

- Decision: Use the current `aspnet-core/` ABP solution as the backend system of
  record and `journeypoint/` as the only in-scope frontend.
- Rationale: This matches the repository layout, the provided source
  specification, and the existing auth and tenant work already merged into the
  repo.
- Alternatives considered: Reviving the Angular app was rejected because the
  user explicitly ruled it out and it would create duplicate frontend effort.

## Decision 2: Model onboarding as reusable templates plus generated journeys

- Decision: Keep `OnboardingPlan`, `OnboardingModule`, and `OnboardingTask` as
  reusable templates, and generate `Journey` plus `JourneyTask` records per
  enrolled hire.
- Rationale: This preserves the repeatable plan-authoring workflow while giving
  facilitators a safe review and personalisation layer per hire.
- Alternatives considered: Generating free-form journeys without templates was
  rejected because it weakens reuse, demo repeatability, and auditability.

## Decision 3: Keep AI human-governed and backend-only

- Decision: Restrict AI use to two explicit backend-triggered flows: plan-level
  document extraction and journey-level personalisation.
- Rationale: This matches the source spec, keeps secrets out of the browser, and
  ensures facilitators approve all AI changes before they affect onboarding.
- Alternatives considered: Automatic AI enrichment and frontend AI calls were
  rejected because they violate the constitution and reduce trust.

## Decision 4: Use append-only records for historical intelligence

- Decision: Treat `EngagementSnapshot` and AI audit records as append-only
  history, and preserve resolved `AtRiskFlag` records instead of deleting them.
- Rationale: The score trend chart, intervention history, and responsible-AI
  story all depend on preserved historical context.
- Alternatives considered: Updating a single current score row was rejected
  because it destroys the trend and audit trail.

## Decision 5: Keep engagement scoring on-demand in the current scope

- Decision: Compute engagement whenever the pipeline or a hire profile is loaded
  rather than introducing a scheduler in the initial milestone plan.
- Rationale: This satisfies the product requirement while keeping milestone scope
  aligned to the five-phase implementation plan.
- Alternatives considered: Adding Hangfire now was rejected because it creates
  operational complexity before the core product loop is complete.

## Decision 6: Use local document storage behind an abstraction

- Decision: Store uploaded plan documents locally for the current phase and
  expose storage through an interface suitable for future cloud replacement.
- Rationale: This keeps local development simple without baking filesystem
  assumptions into application workflows.
- Alternatives considered: Requiring cloud storage now was rejected because it
  would slow delivery without adding demo value.

## Decision 7: Treat milestone planning as a first-class artifact

- Decision: Maintain a roadmap markdown file that records existing GitHub state,
  the new five milestones, and at least 25 issue-ready backlog slices.
- Rationale: The user wants consistent results across multiple AI tools, and a
  markdown roadmap is a better cross-agent source of truth than GitHub state
  alone.
- Alternatives considered: Creating issues directly without an intermediate
  markdown plan was rejected because it would make the backlog harder to replay
  or audit.

## Decision 8: Preserve provider-based feature state in the frontend

- Decision: New stateful frontend features will follow the existing provider
  pattern under `journeypoint/providers/`.
- Rationale: This matches the provided frontend best-practice guide and the
  current codebase.
- Alternatives considered: Introducing a different state library or bypassing
  providers inside page components was rejected because it would fragment the
  frontend architecture.

## Decision 9: Use a hire lifecycle that tracks onboarding readiness separately from journey state

- Decision: Model `HireLifecycleState` as `PendingActivation`, `Active`,
  `Completed`, and `Exited`.
- Rationale: Hire state needs to answer business questions that are broader than
  the journey itself, especially the gap between enrolment and activation and
  the possibility of a hire leaving before onboarding completes.
- Alternatives considered: Reusing journey status as the only hire lifecycle was
  rejected because it makes hire-level reporting and exit handling ambiguous.

## Decision 10: Keep journey lifecycle minimal and aligned to the spec

- Decision: Model `JourneyStatus` as `Draft`, `Active`, `Paused`, and
  `Completed`.
- Rationale: The active spec already describes these states, and they cleanly
  separate pre-activation review from live execution without introducing extra
  cancellation rules into the first milestone-3 domain slice.
- Alternatives considered: Adding a `Cancelled` status now was rejected because
  hire exit can be represented by `HireLifecycleState.Exited` plus a paused
  journey until a concrete cancellation requirement exists.

## Decision 11: Keep journey tasks as copied snapshots with optional source-template references

- Decision: Each `JourneyTask` should persist copied task and module snapshot
  fields, plus optional `SourceOnboardingTaskId` and `SourceOnboardingModuleId`
  references back to the template records.
- Rationale: This keeps generated journeys stable after activation, supports
  facilitator draft edits without mutating templates, and still preserves
  lineage for audit, review, and future refresh logic.
- Alternatives considered: Reading task content directly from `OnboardingTask`
  after generation was rejected because later template edits would leak into
  already-generated journeys.

## Decision 12: Avoid a separate journey-module entity in the initial M3 slice

- Decision: Do not introduce `JourneyModule` in JP-013; instead, store module
  snapshot title and order directly on `JourneyTask`.
- Rationale: The user requested a minimal domain file set, and module grouping
  for draft review and participant views can still be reconstructed from task
  snapshots without another aggregate layer.
- Alternatives considered: Adding a dedicated journey-module entity now was
  rejected because it increases file count, persistence complexity, and
  migration scope before a clear mutation requirement exists.

## Decision 13: Keep journey-task completion state minimal and derive overdue status

- Decision: Persist `JourneyTaskStatus` as `Pending` or `Completed`, and derive
  overdue status from `DueOn` plus current time rather than storing a separate
  overdue state.
- Rationale: This matches the on-demand engagement model, avoids time-driven
  mutation churn, and keeps the first hire-orchestration domain slice smaller.
- Alternatives considered: Persisting `Overdue` as a first-class stored status
  was rejected because it would require extra lifecycle transitions without
  changing the facilitator or participant flows in milestone 3.

## Decision 14: Centralize generation and lifecycle validation in a minimal Core manager

- Decision: Introduce a single `HireJourneyManager` plus a small validation
  partial to create hires, generate draft journeys, copy journey tasks, and
  enforce state transitions and tenant-safe ownership checks.
- Rationale: This preserves the repo's current Core-manager pattern and keeps
  AppServices orchestration-only.
- Alternatives considered: Putting these rules on entities or directly in
  AppServices was rejected because it conflicts with the absorbed backend
  standards and makes later M3/M4 extension harder.
