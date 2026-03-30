# REST API Contract Outline

This contract defines the required application surface. Concrete endpoint names
should remain ABP application-service friendly, typically under
`/api/services/app/<ServiceName>/<MethodName>`.

## Authentication and Session

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| Authenticate user | POST | Sign in with tenant-aware credentials | TenantAdmin, Facilitator, Manager, Enrolee |
| Current login info | GET | Resolve current user, tenant, and role context | All authenticated roles |
| Logout/session clear | POST or client action | End the authenticated session cleanly | All authenticated roles |

## Plan Management

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| List plans | GET | Return tenant-scoped onboarding plans with status metadata | Facilitator, TenantAdmin |
| Get plan detail | GET | Return a plan with ordered modules, tasks, and documents | Facilitator, TenantAdmin |
| Create draft plan | POST | Create a new onboarding plan | Facilitator, TenantAdmin |
| Update draft plan | PUT | Update plan metadata and task structure | Facilitator, TenantAdmin |
| Publish plan | POST | Transition a plan from draft to published | Facilitator, TenantAdmin |
| Archive plan | POST | Transition a plan to archived | Facilitator, TenantAdmin |
| Clone plan | POST | Create a deep-copy draft from an existing plan | Facilitator, TenantAdmin |

## Markdown Import

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| Preview document import | POST | Normalize markdown, text, PDF, or image content into plan/module/task preview data | Facilitator |
| Save imported draft | POST | Persist a facilitator-approved imported plan | Facilitator |

## Document Enrichment

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| Upload plan document | POST | Store a markdown, text, PDF, or image file against a saved non-archived plan | Facilitator |
| Start extraction | POST | Trigger AI extraction for the uploaded document | Facilitator |
| List extracted tasks | GET | Return reviewable extraction proposals | Facilitator |
| Review extracted task | POST | Accept, edit, reject, or assign a proposed task | Facilitator |

## Hire Enrolment and Journey Management

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| List hires | GET | Return tenant-scoped hire summaries suitable for facilitator list and filter views, including lifecycle and welcome-notification status metadata | Facilitator, TenantAdmin |
| Get hire detail | GET | Return hire profile, onboarding-plan linkage, account and manager context, journey summary, score history, and flags | Facilitator, Manager |
| Create hire enrolment | POST | Create the hire record, provision a tenant platform account, assign the `Enrolee` role, validate optional manager linkage, initiate welcome notification, and return recoverable notification status | Facilitator |
| Generate draft journey | POST | Synchronously copy the published onboarding plan into a draft journey for an existing hire, preserving source ordering, assignment rules, and due-date rules | Facilitator |
| Resend welcome notification | POST | Retry onboarding credentials delivery | Facilitator |
| Get draft journey | GET | Return generated journey and task review data, including copied task snapshots, ordering metadata, optional source-template ids, and activation-ready draft state | Facilitator |
| Update journey task | PUT | Adjust draft task snapshot details during facilitator review without mutating template records | Facilitator |
| Add journey task | POST | Add a facilitator-authored draft task to a journey with no source-template linkage | Facilitator |
| Remove pending journey task | DELETE or POST | Remove a pending draft task before activation without deleting the template source | Facilitator |
| Activate journey | POST | Transition a journey from draft to active | Facilitator |

## AI Personalisation

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| Request personalisation diff | POST | Trigger backend-only Groq personalisation for one same-tenant journey and return a diff-ready proposal payload plus generation-log metadata | Facilitator |
| Apply selected revisions | POST | Persist only facilitator-approved task revisions after re-validating task eligibility and baseline snapshot timestamps | Facilitator |

## Participant Workspaces

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| Get my journey | GET | Return active journey view for the current enrolee | Enrolee |
| Get journey task detail | GET | Return a detailed task view | Enrolee, Manager |
| Complete my task | POST | Mark an enrolee-owned task complete | Enrolee |
| Get manager task list | GET | Return manager-assigned tasks across direct reports | Manager |
| Complete manager task | POST | Mark a manager-owned task complete | Manager |

## Engagement and Intervention

| Capability | Method | Purpose | Primary Actors |
|-----------|--------|---------|----------------|
| Get pipeline board | GET | Return hires grouped into ordered pipeline columns | Facilitator |
| Get hire intelligence view | GET | Return snapshots, current score, and active flags | Facilitator, Manager |
| Acknowledge at-risk flag | POST | Record facilitator acknowledgement | Facilitator |
| Resolve at-risk flag | POST | Record manual or automatic resolution state | Facilitator |

## Contract Notes

- Tenant context must be resolved before any tenant-scoped mutation or query.
- AI flows must return reviewable payloads rather than silently mutating domain
  records.
- Participant endpoints must return only the data appropriate for the signed-in
  actor.
- Hire detail and pipeline calls are allowed to trigger on-demand engagement
  computation before returning the response.
- The hire-creation response should expose account-provisioning outcome,
  manager-link validation, and welcome-notification status separately from later
  draft-journey generation.
- Hire list, hire detail, and draft journey responses should be shaped so the
  frontend can normalize them into provider-backed list, detail, and review
  state without client-side joins across unrelated endpoints.
- Draft generation must complete synchronously for the current milestone rather
  than delegating task-copy creation to a background job.
- Journey review payloads should expose source-template linkage as optional
  reference metadata only; template fields must not be treated as live joins
  after journey generation.
- Draft review mutations must apply only to `JourneyTask` snapshot data and must
  reject writes that would mutate `OnboardingPlan`, `OnboardingModule`, or
  `OnboardingTask` records from the source template.
- JP-020 personalisation preview is transient in the first slice and is
  returned inline from the request call rather than being stored as a separate
  proposal aggregate for later retrieval.
- Personalisation requests may revise only existing `JourneyTask` snapshot
  fields; task creation and task removal remain outside the AI contract.
- Apply requests must include enough baseline task metadata to reject stale
  proposals when a facilitator or participant has already changed the task
  after the diff was generated.
- Concrete API methods should continue to be exposed through
  interface-and-implementation AppService pairs with DTOs that live beside
  their service slice under `JourneyPoint.Application/Services/<Feature>/Dto/`.
- Web.Core and Web.Host remain transport/plumbing layers only; business rules
  that power these contracts belong in Core, Application, and
  EntityFrameworkCore according to layer responsibility.
