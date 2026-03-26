# JourneyPoint Frontend Agent Guide

This file supplements the root `AGENTS.md` for work inside `journeypoint/`.

## Mandatory source of truth

Before making frontend changes, read:

1. `../AGENTS.md`
2. `../.specify/memory/constitution.md`
3. `../.specify/project.md`
4. `../specs/001-journeypoint-platform/spec.md`
5. `../specs/001-journeypoint-platform/plan.md`
6. `../specs/001-journeypoint-platform/tasks.md`
7. `../specs/001-journeypoint-platform/github-roadmap.md`
8. `../.codex/frontend.md`

## Frontend rules

- Use the Next.js App Router.
- Use provider-based state for stateful features.
- Use `antd-style`.
- Do not use inline styles.
- Do not use untyped `any`.
- Keep AI calls out of the frontend.
- Ignore `../angular/`.

## Delivery rules

For any frontend implementation, state:

- active milestone or task IDs
- assumptions
- files changed
- remaining mismatch between the spec and the UI
