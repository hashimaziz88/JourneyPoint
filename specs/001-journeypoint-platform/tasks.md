# Tasks: JourneyPoint Intelligent Onboarding Platform

**Input**: Design documents from `/specs/001-journeypoint-platform/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rest-api.md

**Tests**: Automated tests are not the primary scope driver for this initiative,
but each milestone includes smoke-validation expectations in `quickstart.md`.

**Organization**: Tasks are grouped by user story so each milestone can be
implemented, demonstrated, and reviewed independently.

## Engineering Standards Overlay

- Backend tasks must follow the internal ABP backend structure and C# coding
  standards: domain entities in `JourneyPoint.Core/Domains/<DomainArea>/`, DTOs
  next to application services, no domain logic in AppServices, XML comments on
  public classes/methods, guard clauses where appropriate, and enums/constants
  instead of magic numbers.
- When a backend slice introduces new product entities, default them to
  `FullAuditedEntity<Guid>` unless the active spec records another key
  strategy, prefer data annotations for entity validation, and move aggregate
  or cross-entity rules into Core domain managers/services.
- Backend application-service tasks should preserve interface-and-
  implementation pairs, DTOs under `Services/<Feature>/Dto/`, AutoMapper-ready
  DTO shapes, and repository usage instead of direct `DbContext` access.
- Backend persistence tasks must keep `DbSet` registration, EF configuration,
  and migrations inside `JourneyPoint.EntityFrameworkCore`; Web.Core and
  Web.Host remain plumbing-only and must not absorb business logic.
- Frontend tasks must follow the strict provider contract:
  `providers/<feature>Provider/actions.tsx`, `context.tsx`, `index.tsx`, and
  `reducer.tsx` only. Bootstrap or side-effect components belong outside
  provider folders.
- Frontend tasks must use Next.js App Router file placement and must not
  regress to legacy `pages/`, `getServerSideProps`, or `getStaticProps`
  patterns from older company notes.
- Frontend styling tasks must preserve `antd-style` and dedicated style-module
  patterns rather than inline styling or Tailwind-first deviations.
- Regular functional components must not declare nested React components in
  their bodies; extract child components into `components/` or another
  dedicated module.
- Frontend provider state, actions, and API contracts must remain explicitly
  typed with no untyped `any`.
- New work must move touched code toward these standards even when older repo
  code predates them, including later milestones for hire orchestration,
  participant workspaces, AI review, engagement, and intervention flows.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the backend and frontend for the JourneyPoint domain
expansion.

- [x] T001 Closed as superseded by JP-006 configuration-contract wiring in `aspnet-core/src/JourneyPoint.Web.Host/appsettings.json` and `aspnet-core/src/JourneyPoint.Web.Host/appsettings.Staging.json`
- [x] T002 [P] Closed as superseded; empty onboarding, journey, and engagement scaffolding will be created alongside real domain work in later issues instead of as a standalone M1 task
- [x] T003 [P] Create JourneyPoint route-group placeholders under `journeypoint/app/(facilitator)/`, `journeypoint/app/(manager)/`, and `journeypoint/app/(enrolee)/`
- [x] T004 [P] Closed as superseded by concrete auth, route, and session constants/types delivered during JP-003, JP-004, and JP-005

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core access control and cross-cutting infrastructure that all user
stories rely on.

- [x] T005 Extend backend permission definitions in `aspnet-core/src/JourneyPoint.Core/Authorization/PermissionNames.cs` and `aspnet-core/src/JourneyPoint.Core/Authorization/JourneyPointAuthorizationProvider.cs`
- [x] T006 Configure role seeding for TenantAdmin, Facilitator, Manager, and Enrolee in `aspnet-core/src/JourneyPoint.Core/Authorization/Roles/AppRoleConfig.cs`
- [x] T007 [P] Extend account and session DTO handling in `aspnet-core/src/JourneyPoint.Application/Authorization/Accounts/` for JourneyPoint role and tenant context needs
- [x] T008 [P] Harden frontend auth and tenant resolution in `journeypoint/providers/authProvider/`, `journeypoint/helpers/useAppSession.tsx`, and `journeypoint/utils/axiosInstance.tsx`
- [x] T009 [P] Add role-aware route guards and shared navigation in `journeypoint/hoc/withAuth.tsx`, `journeypoint/constants/auth/permissions.ts`, and `journeypoint/constants/global/navigation.ts`
- [x] T010 Add Groq, storage, and mail option contracts in `aspnet-core/src/JourneyPoint.Core/Configuration/` and wire them through `aspnet-core/src/JourneyPoint.Web.Host/Startup/`
- [x] T011 Re-scoped to later backend domain milestones; shared DTO mapping and module registration will land with concrete onboarding, journey, and engagement domain issues instead of as a standalone M1 task

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Establish Foundation and Access Control (Priority: P1)

**Goal**: Deliver role-specific shells and tenant-safe navigation on top of the
shared auth flow.

**Independent Test**: TenantAdmin, Facilitator, Manager, and Enrolee can sign
in and reach the correct shell without cross-tenant leakage.

- [x] T012 [P] [US1] Create facilitator shell pages in `journeypoint/app/(facilitator)/facilitator/layout.tsx` and `journeypoint/app/(facilitator)/facilitator/dashboard/page.tsx`
- [x] T013 [P] [US1] Create manager shell pages in `journeypoint/app/(manager)/manager/layout.tsx` and `journeypoint/app/(manager)/manager/my-tasks/page.tsx`
- [x] T014 [P] [US1] Create enrolee shell pages in `journeypoint/app/(enrolee)/enrolee/layout.tsx` and `journeypoint/app/(enrolee)/enrolee/my-journey/page.tsx`
- [x] T015 [P] [US1] Add shared layout components in `journeypoint/layout/`
- [x] T016 [US1] Connect role-aware landing behavior in `journeypoint/app/dashboard/page.tsx` and `journeypoint/components/admin/AdminShell.tsx`
- [x] T017 [US1] Re-scoped to later frontend state refinement; JP-005 already delivers permission-aware navigation and role routing through the shell and route-guard layer
- [x] T018 [US1] Closed as superseded by JP-003 session DTO enrichment; no separate M1 `AccountAppService` current-user endpoint is required

**Checkpoint**: Access control and role shells are demonstrable.

---

## Phase 4: User Story 2 - Author and Enrich Reusable Onboarding Plans (Priority: P1)

**Goal**: Let facilitators create, import, publish, and enrich reusable plans.

**Independent Test**: A facilitator can create a plan manually, import a plan
from markdown, and review document-extracted task proposals.

- [x] T019 [P] [US2] Create plan authoring entities in `aspnet-core/src/JourneyPoint.Core/Domains/OnboardingPlans/OnboardingPlan.cs`, `OnboardingModule.cs`, and `OnboardingTask.cs`
- [ ] T020 [P] [US2] Create enrichment entities in `aspnet-core/src/JourneyPoint.Core/Domains/OnboardingPlans/OnboardingDocument.cs` and `ExtractedTask.cs`
- [x] T021 [US2] Register onboarding `DbSet` properties and mappings in `aspnet-core/src/JourneyPoint.EntityFrameworkCore/EntityFrameworkCore/JourneyPointDbContext.cs` and related configuration files
- [x] T022 [US2] Add initial onboarding migration under `aspnet-core/src/JourneyPoint.EntityFrameworkCore/Migrations/`
- [x] T023 [US2] Implement plan CRUD DTOs and application services in `aspnet-core/src/JourneyPoint.Application/Services/OnboardingPlanService/`
- [ ] T024 [US2] Implement markdown import parsing and draft-save services in `aspnet-core/src/JourneyPoint.Application/Services/MarkdownImportService/`
- [ ] T025 [US2] Implement document upload, extraction orchestration, and proposal review services in `aspnet-core/src/JourneyPoint.Application/Services/OnboardingDocumentService/`
- [x] T026 [P] [US2] Build facilitator plan list and editor pages in `journeypoint/app/(facilitator)/facilitator/plans/page.tsx` and `journeypoint/app/(facilitator)/facilitator/plans/[planId]/page.tsx`
- [ ] T027 [P] [US2] Build markdown import UI in `journeypoint/app/(facilitator)/markdown-import/page.tsx` and `journeypoint/components/plans/MarkdownPreviewTable.tsx`
- [x] T028 [P] [US2] Add plan provider state in `journeypoint/providers/onboardingPlanProvider/`
- [x] T029 [US2] Add plan builder components in `journeypoint/components/plans/PlanCard.tsx`, `PlanEditor.tsx`, `ModulePanel.tsx`, `TaskFormModal.tsx`, and `TaskListEditor.tsx`

**Checkpoint**: Published onboarding plans can be authored and enriched.

---

## Phase 5: User Story 3 - Enrol Hires and Generate Reviewable Journeys (Priority: P1)

**Goal**: Convert published plans into reviewable hire-specific journeys.

**Independent Test**: A facilitator can enrol a hire, generate a draft journey,
review the task list, and activate the journey.

- [ ] T030 [P] [US3] Create hire and journey entities in `aspnet-core/src/JourneyPoint.Core/Domains/Hires/Hire.cs`, `Journey.cs`, and `JourneyTask.cs`
- [ ] T031 [US3] Register hire and journey persistence in `aspnet-core/src/JourneyPoint.EntityFrameworkCore/EntityFrameworkCore/JourneyPointDbContext.cs` and a follow-up migration under `aspnet-core/src/JourneyPoint.EntityFrameworkCore/Migrations/`
- [ ] T032 [US3] Implement hire enrolment and journey generation services in `aspnet-core/src/JourneyPoint.Application/Services/HireService/` and `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/`
- [ ] T033 [US3] Implement welcome-notification and storage abstractions in `aspnet-core/src/JourneyPoint.Application/Services/NotificationService/` and `aspnet-core/src/JourneyPoint.Application/Services/FileStorageService/`
- [ ] T034 [P] [US3] Build facilitator hire pages in `journeypoint/app/(facilitator)/hires/page.tsx` and `journeypoint/app/(facilitator)/hires/[hireId]/page.tsx`
- [ ] T035 [P] [US3] Build journey review page in `journeypoint/app/(facilitator)/hires/[hireId]/journey/page.tsx`
- [ ] T036 [P] [US3] Add hire and journey provider state in `journeypoint/providers/hireProvider/` and `journeypoint/providers/journeyProvider/`
- [ ] T037 [US3] Add hire and journey components in `journeypoint/components/hires/HireForm.tsx`, `HireCard.tsx`, and `journeypoint/components/journey/JourneyTaskList.tsx`

**Checkpoint**: Hire enrolment and journey activation are demonstrable.

---

## Phase 6: User Story 4 - Guide Participants with Human-in-the-Loop AI (Priority: P2)

**Goal**: Deliver role-specific workspaces and controlled AI personalisation.

**Independent Test**: Enrolees and managers complete tasks, and facilitators can
review AI-generated journey revisions before applying them.

- [ ] T038 [P] [US4] Create AI audit entity in `aspnet-core/src/JourneyPoint.Core/Domains/Audit/GenerationLog.cs`
- [ ] T039 [US4] Implement Groq extraction and personalisation client services in `aspnet-core/src/JourneyPoint.Application/Services/GroqService/`
- [ ] T040 [US4] Extend journey application services for diff review and selective acceptance in `aspnet-core/src/JourneyPoint.Application/Services/JourneyService/`
- [ ] T041 [P] [US4] Build enrolee journey pages in `journeypoint/app/(enrolee)/my-journey/page.tsx` and `journeypoint/app/(enrolee)/my-journey/tasks/[taskId]/page.tsx`
- [ ] T042 [P] [US4] Build manager task page in `journeypoint/app/(manager)/my-tasks/page.tsx`
- [ ] T043 [P] [US4] Add participant components in `journeypoint/components/journey/PersonalisationDiff.tsx` and `journeypoint/components/journey/JourneyTaskList.tsx`
- [ ] T044 [US4] Add manager and enrolee action handling in `journeypoint/providers/journeyProvider/` and `journeypoint/providers/userProvider/`

**Checkpoint**: Participant workspaces and AI review flow are demonstrable.

---

## Phase 7: User Story 5 - Monitor Engagement and Intervene Early (Priority: P2)

**Goal**: Deliver intelligence, flags, pipeline visibility, and intervention
history.

**Independent Test**: Opening a pipeline or hire detail view computes fresh
engagement data, surfaces at-risk hires, and supports facilitator intervention.

- [ ] T045 [P] [US5] Create engagement entities in `aspnet-core/src/JourneyPoint.Core/Domains/Engagement/EngagementSnapshot.cs` and `AtRiskFlag.cs`
- [ ] T046 [US5] Register engagement persistence and migration updates in `aspnet-core/src/JourneyPoint.EntityFrameworkCore/EntityFrameworkCore/JourneyPointDbContext.cs` and `aspnet-core/src/JourneyPoint.EntityFrameworkCore/Migrations/`
- [ ] T047 [US5] Implement engagement scoring domain service in `aspnet-core/src/JourneyPoint.Core/Domains/Engagement/EngagementScoreService.cs`
- [ ] T048 [US5] Implement pipeline, hire intelligence, and intervention services in `aspnet-core/src/JourneyPoint.Application/Services/EngagementService/`
- [ ] T049 [P] [US5] Build facilitator pipeline page in `journeypoint/app/(facilitator)/pipeline/page.tsx`
- [ ] T050 [P] [US5] Add engagement and pipeline provider state in `journeypoint/providers/engagementProvider/` and `journeypoint/providers/pipelineProvider/`
- [ ] T051 [P] [US5] Build intelligence components in `journeypoint/components/pipeline/PipelineKanban.tsx`, `PipelineColumn.tsx`, `HirePipelineCard.tsx`, `journeypoint/components/engagement/EngagementBadge.tsx`, `AtRiskFlagPanel.tsx`, and `journeypoint/components/journey/ScoreTrendChart.tsx`
- [ ] T052 [US5] Seed Boxfusion and DeptDemo demo data in `aspnet-core/src/JourneyPoint.EntityFrameworkCore/EntityFrameworkCore/Seed/`
- [ ] T053 [US5] Add facilitator intervention capture and flag history UI in `journeypoint/app/(facilitator)/hires/[hireId]/page.tsx`

**Checkpoint**: Intelligence, flags, pipeline, and intervention flows are demonstrable.

---

## Phase 8: Polish and Cross-Cutting Concerns

**Purpose**: Finalize documentation, smoke validation, and readiness artifacts.

- [ ] T054 [P] Update onboarding architecture and delivery notes in `README.md`, `.specify/project.md`, and `specs/001-journeypoint-platform/quickstart.md`
- [x] T055 [P] Update cross-agent guidance in `AGENTS.md`, `CLAUDE.md`, `journeypoint/AGENTS.md`, `journeypoint/CLAUDE.md`, and `.github/copilot-instructions.md`
- [ ] T056 Run milestone smoke validation using `specs/001-journeypoint-platform/quickstart.md`
- [x] T057 Review issue slicing and milestone readiness in `specs/001-journeypoint-platform/github-roadmap.md`
- [x] T058 Align repo guidance, Speckit templates, and current M1-owned backend/frontend implementation surfaces to the absorbed company engineering standards before starting M2

---

## Dependencies and Execution Order

### Phase Dependencies

- Setup (Phase 1): starts immediately
- Foundational (Phase 2): depends on Setup and blocks all user stories
- User Story phases (Phases 3-7): depend on Foundational, then proceed in
  milestone order
- Polish (Phase 8): depends on the desired user story phases being complete

### User Story Dependencies

- US1 provides role-specific shell access and should be complete before heavy
  feature routing depends on it.
- US2 provides published plans that US3 enrolment relies on.
- US3 provides active journeys required by US4 participant and AI workflows.
- US5 depends on journey execution data from US3 and US4.

### Parallel Opportunities

- Tasks marked [P] can be worked on concurrently when their prerequisites are
  satisfied.
- Backend entity creation and frontend route/provider scaffolding can often run
  in parallel within the same milestone.
- Documentation and guidance refresh tasks can run alongside late-stage polish.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational work.
2. Complete US1, US2, and US3.
3. Validate hire enrolment through journey activation before moving on.

### Incremental Delivery

1. Milestone 1: foundation and access control
2. Milestone 2: plan authoring and content ingestion
3. Milestone 3: hire enrolment and journey orchestration
4. Milestone 4: participant experience and human-in-the-loop AI
5. Milestone 5: engagement intelligence and interventions

### Parallel Team Strategy

1. Pair backend and frontend contributors during Foundational work.
2. Split plan-authoring and journey-enrolment work by backend/frontend surfaces.
3. Reserve intelligence and intervention work for after the core product loop is
   demonstrable.
