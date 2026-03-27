# Claude Code Instructions for JourneyPoint

`AGENTS.md` is the root operating guide for this repository.

## Canonical Source of Truth

After reading `AGENTS.md`, follow this order:

1. `.specify/memory/constitution.md`
2. `.specify/project.md`
3. the active feature package `specs/001-journeypoint-platform/`:
   `spec.md`, `plan.md`, `tasks.md`, and `github-roadmap.md`
4. lower-priority assistant guidance files such as this file,
   `.github/copilot-instructions.md`, and `.codex/context.md`

JourneyPoint uses spec-driven delivery.

Do not infer the active feature package from branch names or historical GitHub
milestone wording. `angular/` is out of scope.

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
- follow the internal ABP backend structure and coding rules now encoded in the
  repo guidance
- keep provider folders on the strict four-file contract only
- do not declare regular nested React components inside other functional
  component bodies
- follow the internal ABP backend structure and coding rules now encoded in the
  repo guidance
- keep provider folders on the strict four-file contract only
- do not declare regular nested React components inside other functional
  component bodies
