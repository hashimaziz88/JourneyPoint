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

## Decision 15: Keep hire account provisioning in the Application layer

- Decision: JP-015 should create hires through a `HireAppService` that
  orchestrates `HireJourneyManager`, `UserManager`, `RoleManager`, and the
  welcome-notification abstraction inside one tenant-aware application flow.
- Rationale: Hire aggregate validation belongs in Core, but identity account
  creation and role assignment are ABP application concerns and should not be
  pushed into the domain manager.
- Alternatives considered: Creating users directly from Core or from Web.Host
  was rejected because it breaks ABP layering and mixes infrastructure with
  domain rules.

## Decision 16: Assign only the Enrolee role and validate manager linkage separately

- Decision: Newly provisioned hire accounts should receive only the `Enrolee`
  role during JP-015, while optional `ManagerUserId` remains a reference to an
  existing same-tenant user validated to hold the `Manager` role.
- Rationale: This keeps least-privilege defaults for new hires and avoids
  silently creating or mutating manager accounts during enrolment.
- Alternatives considered: Copying facilitator roles, auto-creating managers,
  or skipping manager-role validation were rejected because they weaken role
  safety and create ambiguous onboarding ownership.

## Decision 17: Treat welcome delivery failures as recoverable enrolment outcomes

- Decision: The hire enrolment flow should initiate welcome notification
  immediately after account creation, but a mail/send failure must not roll back
  the hire or platform user. Instead, the system should persist a recoverable
  welcome state on the hire plus safe attempt metadata for later retry in
  JP-018.
- Rationale: Email and notification providers are more failure-prone than local
  entity writes, so rolling back the entire enrolment for a transient send
  error would frustrate facilitators and create duplicate-account risk.
- Alternatives considered: Rolling back account creation on send failure or
  introducing a dedicated communication aggregate in JP-015 were rejected as
  either too brittle or too heavy for the current slice.

## Decision 18: Never persist plaintext onboarding credentials

- Decision: The initial generated password or activation secret may be used
  in-memory for the first welcome-notification attempt, but plaintext
  credentials must never be stored on `Hire` or in a notification table. Future
  resend flows should reset or reissue credentials instead of reading a stored
  secret.
- Rationale: Recoverable notification behavior is required, but storing
  original credentials would create unnecessary security risk and conflict with
  the repo's accountable platform posture.
- Alternatives considered: Persisting the original temporary password for later
  resend was rejected because it increases breach impact and is not needed once
  a reset/reissue path exists.

## Decision 19: Keep synchronous draft generation in a dedicated Journey application service

- Decision: JP-016 should introduce `JourneyAppService` for draft generation and
  draft-review mutations rather than extending `HireAppService` further.
- Rationale: `HireAppService` already owns identity and welcome-notification
  orchestration, while synchronous journey generation and review are a separate
  use-case slice that still depends on the same Core manager rules.
- Alternatives considered: Folding generation and review into `HireAppService`
  was rejected because it would blur service boundaries and make the milestone-3
  application layer harder to keep under the repository's file-size and
  readability standards.

## Decision 20: Compute journey due dates from the hire start date plus template offsets

- Decision: Draft generation should compute each `JourneyTask.DueOn` from the
  persisted `Hire.StartDate` plus the copied template `DueDayOffset`.
- Rationale: This preserves deterministic tenant-safe scheduling, matches the
  current domain model, and keeps generated tasks stable even if the source
  template is later edited.
- Alternatives considered: Recomputing due dates from the current date or
  reading them live from the template after generation was rejected because it
  would make draft review nondeterministic and violate the snapshot requirement.

## Decision 21: Allow draft-only journey review edits on copied task snapshots

- Decision: Facilitators may review a draft journey by editing copied snapshot
  fields, adding new facilitator-authored tasks with no source-template ids, and
  removing only pending draft tasks before activation.
- Rationale: This satisfies the reviewable-draft requirement while preserving
  the rule that onboarding-plan templates affect only future journeys.
- Alternatives considered: Locking all generated tasks against change or writing
  review edits back to `OnboardingTask` was rejected because both approaches
  conflict with the product requirement for per-hire review without template
  mutation.

## Decision 22: Split facilitator M3 UI into dedicated hire-list, hire-detail, and journey-review routes

- Decision: JP-017 should use three App Router pages under the facilitator route
  group: a tenant-scoped hire index, a hire detail page, and a dedicated journey
  review page nested under the selected hire.
- Rationale: This keeps each page under the repo's file-size and readability
  standards while matching the natural facilitator workflow from cohort browse,
  to hire context, to detailed draft review and activation.
- Alternatives considered: Rendering the full journey review editor inline on
  the hire list or collapsing hire detail and journey review into one oversized
  page was rejected because it would increase route complexity and produce
  harder-to-maintain frontend files.

## Decision 23: Use separate provider slices for hire queries and journey review mutations

- Decision: JP-017 should introduce `hireProvider` for list/detail state and
  `journeyProvider` for draft review, task mutations, and activation.
- Rationale: The provider contract is mandatory in this frontend, and splitting
  hire queries from journey review mutations limits avoidable rerenders while
  keeping provider folders on the strict four-file shape.
- Alternatives considered: Reusing one provider for both pages or colocating all
  state inside route components was rejected because it would blur concerns and
  conflict with the current repo state-management pattern.

## Decision 24: Keep journey review state server-authoritative after each mutation

- Decision: The journey-review UI should treat backend responses as the source
  of truth after generate, update, add, remove, and activate actions rather than
  maintaining a long-lived client-only shadow draft.
- Rationale: The backend already owns due-date calculation, ordering validation,
  and draft activation rules, so rehydrating from server responses reduces drift
  and keeps review state consistent across refreshes and later facilitator UI
  additions.
- Alternatives considered: Holding the editable journey draft entirely in client
  state until a later save was rejected because it would duplicate backend rules
  in the browser and increase mismatch risk for ordering and activation logic.

## Decision 25: Assemble personalisation requests from current journey snapshots and only eligible pending tasks

- Decision: JP-020 should build the Groq personalisation request from the
  tenant-scoped hire, journey, onboarding-plan metadata, and only the current
  pending `JourneyTask` snapshot fields that are eligible for revision.
- Rationale: The model needs enough context to personalize wording and timing,
  but sending only pending task snapshots keeps prompt size, latency, and token
  cost bounded while avoiding accidental proposals against completed work.
- Alternatives considered: Sending the full historical journey payload or
  re-reading live template tasks was rejected because it would bloat the prompt
  and weaken the snapshot-based journey model.

## Decision 26: Return the personalisation diff preview inline instead of persisting a separate proposal aggregate

- Decision: The request-personalisation endpoint should return a transient
  diff-ready proposal payload immediately, and JP-020 should not introduce a new
  persisted proposal entity before the facilitator applies selected changes.
- Rationale: The system already has append-only `GenerationLog` audit records
  for the AI run, while keeping the diff preview transient avoids another table,
  another lifecycle, and another source of drift between review and apply.
- Alternatives considered: Persisting a long-lived proposal aggregate was
  rejected because it adds storage and cleanup complexity before there is a
  proven workflow need for saved drafts of AI suggestions.

## Decision 27: Parse Groq output into strict per-task field deltas only

- Decision: The Groq response contract should be keyed to existing
  `JourneyTaskId` values and limited to whitelisted editable snapshot fields
  such as title, description, category, assignment target, acknowledgement
  rule, and due-day offset.
- Rationale: JP-020 is a selective-revision flow, not a second draft-generation
  engine, so the parser must reject add/remove semantics, unknown task ids,
  duplicate task proposals, and unsupported fields before anything reaches the
  facilitator review step.
- Alternatives considered: Allowing the model to add/remove tasks or return
  free-form markdown diffs was rejected because it would be harder to validate,
  harder to review safely, and contrary to the spec assumption that AI
  personalisation revises existing tasks only.

## Decision 28: Protect selective apply with baseline snapshot timestamps

- Decision: Each task diff should include a baseline timestamp derived from the
  current `JourneyTask` snapshot, and apply requests must fail when the current
  task no longer matches that reviewed baseline.
- Rationale: Facilitators can still edit draft or active journey tasks manually,
  so this check prevents stale AI diffs from overwriting newer human-reviewed
  content.
- Alternatives considered: Blindly applying the selected changes or persisting
  a heavyweight server-side proposal lock was rejected because one is unsafe and
  the other adds unnecessary complexity for the first personalisation slice.

## Decision 29: Reuse GenerationLog for personalisation runs and store proposal counts in audit metadata

- Decision: Every JP-020 personalisation request should write one
  `GenerationLog` row with `WorkflowType = Personalisation`, timing metadata,
  model name, prompt/response summaries, and the count of revised tasks
  proposed by the model.
- Rationale: JP-019 already introduced the reusable audit trail, and JP-020
  should consume that existing append-only model instead of inventing a second
  audit store for personalisation.
- Alternatives considered: Auditing only successful applies or adding a
  personalisation-specific audit table was rejected because it would weaken
  traceability and duplicate audit behavior across AI flows.

## Decision 30: Split enrolee participation into a dashboard route plus a dedicated task-detail route

- Decision: JP-021 should replace the placeholder enrolee landing page with a
  module-grouped dashboard at `journeypoint/app/(enrolee)/enrolee/my-journey/page.tsx`
  and a nested task-detail route at
  `journeypoint/app/(enrolee)/enrolee/my-journey/tasks/[taskId]/page.tsx`.
- Rationale: The current repo already uses role-shell route groups such as
  `(facilitator)/facilitator/...` and `(enrolee)/enrolee/...`, and splitting the
  participant workspace into a dashboard and task detail keeps each page under
  the repository's file-size and readability standards.
- Alternatives considered: Keeping a single oversized dashboard-only page or
  inventing a second enrolee route tree outside the existing role shell was
  rejected because it would either bloat one page or fight the live App Router
  structure.

## Decision 31: Use participant-specific journey contracts instead of reusing facilitator draft-review DTOs

- Decision: JP-021 should add a participant-safe read/action surface under
  `JourneyService` that returns active-journey dashboard and task-detail DTOs
  for enrolees, while keeping facilitator draft-review contracts separate.
- Rationale: The current `JourneyDraftDto` and review endpoints expose
  source-template ids, draft-only controls, and facilitator mutation semantics
  that do not belong in an enrolee-facing workspace.
- Alternatives considered: Reusing `GetDraftAsync` and filtering fields in the
  browser was rejected because it would overexpose facilitator-oriented data and
  blur the separation between draft review and active journey participation.

## Decision 32: Model acknowledgement as an explicit participant action before completion when required

- Decision: Enrolee task execution should use a separate acknowledge action and
  a separate complete action, with backend validation enforcing acknowledgement
  first whenever the task's rule requires it.
- Rationale: A two-step flow keeps the task-detail UI clear, preserves the
  meaning of `AcknowledgedAt` and `CompletedAt`, and avoids implicit completion
  side effects that are harder to explain or audit.
- Alternatives considered: Auto-acknowledging on completion or collapsing both
  transitions into one opaque endpoint was rejected because it hides an
  important onboarding control and weakens task-state clarity.

## Decision 33: Persist a durable task-level personalisation marker for participant views

- Decision: JP-021 should expose participant-visible personalisation indicators
  from durable `JourneyTask` metadata, using a nullable timestamp marker that is
  set only when facilitator-approved AI revisions are actually applied.
- Rationale: Enrolee dashboards reload independently of the facilitator session,
  so participant views need a persistent way to show that a task has been
  tailored without relying on transient proposal payloads or in-memory state.
- Alternatives considered: Inferring indicators from the current source
  template, from transient frontend provider state, or from aggregate
  `GenerationLog` summaries was rejected because those approaches cannot
  reliably identify which active tasks were actually personalised after reload.

## Decision 34: Embed facilitator personalisation review into the existing journey-review route

- Decision: JP-023 should extend the existing facilitator journey review page at
  `journeypoint/app/(facilitator)/facilitator/hires/[hireId]/journey/page.tsx`
  rather than introducing a second facilitator route just for AI review.
- Rationale: Facilitators already generate, edit, and activate journey drafts in
  that workspace, so keeping personalisation review in the same screen reduces
  route churn and keeps draft context, hire context, and apply actions together.
- Alternatives considered: Creating a separate personalisation route was
  rejected because it would duplicate journey-loading logic and fragment the
  facilitator review workflow.

## Decision 35: Keep AI proposal review state transient in the journey provider

- Decision: JP-023 should store the returned `JourneyPersonalisationProposal`
  plus explicit accept/reject selections in typed `journeyProvider` state until
  the facilitator applies or clears the review.
- Rationale: The backend already treats the proposal as transient and
  append-only audit is handled by `GenerationLog`, so the frontend should keep
  review state lightweight and session-scoped while still allowing deliberate
  per-task review actions.
- Alternatives considered: Persisting facilitator selection state separately or
  encoding selections into component-local state only was rejected because the
  first adds needless storage complexity and the second makes refresh and shared
  page interactions brittle.

## Decision 36: Default diff proposals to explicit facilitator acceptance instead of implicit apply-all

- Decision: Each returned task diff should start unselected in the UI and
  require an explicit accept action before it is included in the apply payload.
- Rationale: Human-governed AI is a core product rule, and explicit accept or
  reject controls make facilitator intent visible while preventing a large
  proposal from being accidentally applied wholesale.
- Alternatives considered: Auto-selecting all diffs or treating unopened diffs
  as implicitly accepted was rejected because both approaches weaken review
  clarity and make selective acceptance less trustworthy.

## Decision 37: Keep engagement history append-only and tenant-scoped

- Decision: JP-025 should model `EngagementSnapshot` as an append-only,
  same-tenant historical record linked to both `Hire` and `Journey`, with one
  row written per engagement computation instead of updating a current-score
  record in place.
- Rationale: Pipeline trends, score-history charts, and intervention auditing
  depend on preserved point-in-time metrics rather than only the latest score.
- Alternatives considered: Storing only a current score on `Hire` or updating
  the latest snapshot row was rejected because it destroys historical context
  and weakens the intervention story.

## Decision 38: Treat at-risk flags as durable intervention records with a simple lifecycle

- Decision: JP-025 should model `AtRiskFlag` as a durable intervention record
  with lifecycle `Active -> Acknowledged -> Resolved`, preserving
  acknowledgement and resolution metadata instead of deleting or overwriting old
  flags.
- Rationale: Facilitators need to see when a hire first became at risk, who
  acknowledged the problem, and how it was later resolved.
- Alternatives considered: Soft-deleting old flags or storing only a boolean
  at-risk marker on `Hire` was rejected because both approaches lose the
  operational history required for review and demo scenarios.

## Decision 39: Allow one unresolved at-risk flag per hire in the initial M5 slice

- Decision: JP-025 should enforce at most one unresolved `AtRiskFlag` for a
  hire at a time, while still allowing future risk episodes to create new rows
  once the prior flag has been resolved.
- Rationale: This keeps intervention workflows simple for milestone 5 and
  matches the active spec requirement that a new flag is raised only when one
  does not already exist.
- Alternatives considered: Allowing multiple concurrent active flags or a
  single mutable flag reused forever was rejected because the former creates
  noisy intervention state and the latter collapses distinct risk episodes into
  one record.

## Decision 40: Use a weighted 0..100 composite score with bounded sub-scores

- Decision: JP-026 should compute one `CompositeScore` in the `0..100` range
  from three bounded sub-scores: completion contributes 50%, recency
  contributes 30%, and overdue-task pressure contributes 20%.
- Rationale: Completion is the clearest progress signal, but recency and
  overdue work still need enough weight to surface stalled journeys before task
  completion alone makes the hire look healthier than they are.
- Alternatives considered: Equal weighting was rejected because it
  over-amplifies overdue count on journeys with few tasks, and a completion-only
  score was rejected because it hides disengagement until too late.

## Decision 41: Normalize recency and overdue inputs with simple clamped rules

- Decision: JP-026 should normalize recency to `100` when activity is recent
  and linearly decay it to `0` by day 14, while overdue pressure should start
  at `100` and lose `25` points per overdue task with a floor at `0`.
- Rationale: These rules are deterministic, easy to explain in demos, and
  small enough to keep the first scoring service transparent without introducing
  opaque heuristics or tenant-tunable weights.
- Alternatives considered: Exponential decay and more granular penalty curves
  were rejected because they are harder to reason about during milestone-5
  validation and provide little immediate product value.

## Decision 42: Use three shared classification bands for all facilitator reads

- Decision: JP-026 should map the composite score into the shared bands
  `Healthy` for scores `>= 75`, `NeedsAttention` for scores `>= 50` and `< 75`,
  and `AtRisk` for scores `< 50`.
- Rationale: These thresholds align with the existing product language in the
  active spec and keep automated at-risk flag behavior easy to predict once
  JP-027 starts raising and resolving flags from the computed classification.
- Alternatives considered: More bands were rejected because the UI and seed
  data only require the three existing states, and a higher at-risk threshold
  was rejected because it would flood milestone-5 demos with false positives.

## Decision 43: Keep engagement scoring as a pure Core service reused on demand

- Decision: JP-026 should introduce a pure `EngagementScoreService` in
  `JourneyPoint.Core/Domains/Engagement/` with no repository or EF dependencies,
  returning one deterministic result object that pipeline and hire-detail
  application services can both call during on-demand reads.
- Rationale: This preserves ABP layer boundaries, prevents duplicated formulas
  across future AppServices, and matches the approved on-demand scoring model in
  the active spec.
- Alternatives considered: Putting formulas directly in `EngagementAppService`
  or persisting precomputed score state on every task mutation was rejected
  because both approaches increase drift risk and conflict with the current
  milestone scope.

## Decision 44: Expose milestone-5 analytics through one dedicated Engagement AppService

- Decision: JP-027 should introduce `IEngagementAppService` and
  `EngagementAppService` under
  `aspnet-core/src/JourneyPoint.Application/Services/EngagementService/`,
  rather than spreading facilitator analytics endpoints across `HireService`
  and `JourneyService`.
- Rationale: Pipeline, hire-intelligence, and intervention flows all depend on
  the same repositories, scoring service, and at-risk flag rules, so one
  service slice keeps DTOs and orchestration cohesive.
- Alternatives considered: Extending `HireAppService` for profile analytics and
  creating a separate pipeline service was rejected because it would duplicate
  engagement-computation orchestration and split the intervention model across
  multiple service boundaries.

## Decision 45: Compute at most once per hire within a single request path

- Decision: JP-027 should run on-demand engagement computation once per hire
  per application-service request, reuse that in-memory result while shaping the
  response, and append exactly one new `EngagementSnapshot` row for that request
  path.
- Rationale: This still satisfies the spec's on-demand behavior while avoiding
  accidental duplicate snapshots from repeated scoring calls inside one pipeline
  or hire-detail response assembly.
- Alternatives considered: Debouncing across separate HTTP requests was
  rejected because it weakens the explicit “compute on open” requirement, and
  writing a snapshot every time any internal helper needs the score was
  rejected because it creates noisy history with no product value.

## Decision 46: Raise and resolve at-risk flags from classification transitions

- Decision: JP-027 should raise a new `Active` flag only when the latest
  computed classification is `AtRisk` and no unresolved flag exists for the
  hire, leave unresolved flags open while the classification remains
  `NeedsAttention` or `AtRisk`, and auto-resolve the unresolved flag only when
  the classification returns to `Healthy`.
- Rationale: This matches the approved milestone-5 lifecycle, keeps unresolved
  interventions stable while a hire is still struggling, and avoids noisy flag
  churn when a hire moves between `NeedsAttention` and `AtRisk`.
- Alternatives considered: Raising separate flags for both `NeedsAttention` and
  `AtRisk`, or auto-resolving as soon as the score rises above the at-risk
  threshold, was rejected because both options would create confusing
  facilitator history.

## Decision 47: Keep acknowledgement and manual resolution as explicit facilitator actions

- Decision: JP-027 should allow acknowledgement only for `Active` flags and
  manual resolution for `Active` or `Acknowledged` flags, recording notes,
  acting user id, and timestamps without overwriting prior raised or
  acknowledgement context.
- Rationale: These rules keep the intervention history auditable and simple for
  later UI flows, while making repeated or invalid actions fail fast.
- Alternatives considered: Idempotent no-op acknowledgements or allowing
  resolution of already resolved flags was rejected because it hides operator
  mistakes and weakens lifecycle clarity.

## Decision 48: Shape pipeline and hire-detail payloads around current intelligence plus history

- Decision: JP-027 should return a pipeline payload grouped into ordered module
  columns plus a final completion column, with each card containing hire
  identity, current module stage, latest score/classification, and active-flag
  visibility; the hire-detail payload should include hire summary, current
  intelligence, recent snapshot history, active flag, and resolved intervention
  history.
- Rationale: This gives JP-028 and JP-029 the typed backend contracts they need
  without forcing frontend joins across unrelated analytics endpoints.
- Alternatives considered: Returning only raw snapshots and flags or splitting
  current versus historical data into many smaller endpoints was rejected
  because it would complicate provider state and broaden frontend orchestration.

## Decision 49: Deliver pipeline analytics in one dedicated facilitator route

- Decision: JP-028 should add one dedicated App Router page at
  `journeypoint/app/(facilitator)/facilitator/pipeline/page.tsx` rather than
  embedding the board into the facilitator dashboard or hire list.
- Rationale: The pipeline is its own milestone-5 workspace with filters,
  cross-hire comparisons, and drill-in behavior that would overcrowd an
  existing route.
- Alternatives considered: Rendering the board inline on the facilitator
  dashboard or inside the hire list was rejected because both would combine too
  many unrelated responsibilities into one page.

## Decision 50: Render module-derived columns directly from the backend payload

- Decision: JP-028 should render pipeline columns from the ordered
  `PipelineColumnDto` list returned by `EngagementAppService`, preserving the
  module-derived columns plus the completion column exactly as scored on the
  backend.
- Rationale: JP-027 already centralizes current-stage derivation, and redoing
  that logic in the browser would risk mismatches between the board and hire
  intelligence views.
- Alternatives considered: Hardcoding known module names or rebuilding columns
  client-side from hire cards was rejected because both approaches drift from
  the authoritative backend response.

## Decision 51: Use lightweight reusable engagement badges on hire cards

- Decision: JP-028 should introduce small presentational badges for engagement
  classification and active at-risk visibility, keeping score text secondary to
  clear visual state on each pipeline card.
- Rationale: Facilitators need to scan many hires quickly, so compact badge
  language communicates risk and health faster than verbose analytics text.
- Alternatives considered: Displaying only raw scores or using large text-only
  status blocks was rejected because both make the board harder to scan at a
  glance.

## Decision 52: Keep pipeline filtering provider-backed and server-authoritative

- Decision: JP-028 should introduce a dedicated `pipelineProvider` that stores
  the current keyword and classification filters plus the latest typed board
  payload, and should refetch from the backend when filters change instead of
  re-filtering a stale local board.
- Rationale: Engagement snapshots are computed on demand in JP-027, so fresh
  backend reads are part of the product behavior and should remain the source
  of truth for filtered boards.
- Alternatives considered: Filtering a previously loaded board entirely in
  local component state was rejected because it can hide newly computed
  engagement changes and make pipeline cards stale across facilitator actions.
