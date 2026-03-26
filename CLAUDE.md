# Claude Code Instructions for JourneyPoint

Read these first:

1. `AGENTS.md`
2. `.specify/memory/constitution.md`
3. `.specify/project.md`
4. `specs/001-journeypoint-platform/spec.md`
5. `specs/001-journeypoint-platform/plan.md`
6. `specs/001-journeypoint-platform/tasks.md`
7. `specs/001-journeypoint-platform/github-roadmap.md`

JourneyPoint uses spec-driven delivery.

When implementing:

1. identify the active milestone or task slice
2. keep changes within the current roadmap slice
3. preserve ABP multi-tenancy and auth flow
4. keep AI backend-only and facilitator-governed
5. preserve provider-based frontend architecture
6. update docs or tasks if implementation intent changes

Guardrails:

- ignore `angular/`
- do not bypass tenant isolation
- do not add inline styling
- do not add untyped `any`
