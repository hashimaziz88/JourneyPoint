# Claude Code Instructions for JourneyPoint Frontend

`../AGENTS.md` is the root operating guide for frontend work.

## Canonical Source of Truth

After reading `../AGENTS.md`, follow this order:

1. `../.specify/memory/constitution.md`
2. `../.specify/project.md`
3. the active feature package `../specs/001-journeypoint-platform/`:
   `spec.md`, `plan.md`, `tasks.md`, and `github-roadmap.md`
4. `../.codex/context.md`
5. `../.codex/frontend.md`

Do not infer the active feature package from branch names. `../angular/` is out
of scope.

When implementing:

1. identify the active milestone or task IDs
2. keep changes within scope
3. preserve the existing auth and tenant flow
4. keep AI calls backend-only
5. do not bypass providers in frontend features
6. do not add inline styling or untyped `any`
7. keep providers on the strict four-file contract only
8. do not declare regular nested React components inside component bodies
9. normalize older external company notes to JourneyPoint's App Router and
   `antd-style` stack instead of copying conflicting legacy patterns
