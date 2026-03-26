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
