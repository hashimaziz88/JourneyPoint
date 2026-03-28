# JourneyPoint Frontend Agent Guide

This file supplements the root `AGENTS.md` for work inside `journeypoint/`.
It does not override the canonical source-of-truth order defined there.

## Mandatory source of truth

Before making frontend changes, read:

1. `../AGENTS.md`
2. `../.specify/memory/constitution.md`
3. `../.specify/project.md`
4. the active feature package `../specs/001-journeypoint-platform/`:
   `spec.md`, `plan.md`, `tasks.md`, and `github-roadmap.md`
5. `../.codex/context.md`
6. `../.codex/frontend.md`

Do not infer a different feature package from the current branch name. Ignore
`../angular/`.

## Frontend rules

- Use the Next.js App Router.
- Use provider-based state for stateful features.
- Use `antd-style`.
- Do not use inline styles.
- Do not use untyped `any`.
- Keep JourneyPoint-owned handwritten frontend source files at or under 350
  lines. Generated artifacts such as build output are excluded.
- Keep provider folders on the strict four-file contract only:
  `actions.tsx`, `context.tsx`, `index.tsx`, and `reducer.tsx`.
- Keep cross-cutting bootstrap and auth/session restoration logic outside
  provider folders.
- Do not declare regular nested React components inside other component bodies.
- Do not leave loose helper methods, constants, interfaces, or sample data
  inside large component or provider files when they belong in `components/`,
  `types/`, `constants/`, `helpers/`, `hoc/`, or `utils/`.
- Normalize older company guidance to JourneyPoint's actual stack: do not add
  legacy `pages/`, `getServerSideProps`, `getStaticProps`, or Tailwind-first
  patterns here.
- Keep AI calls out of the frontend.
- Ignore `../angular/`.

## Delivery rules

For any frontend implementation, state:

- active milestone or task IDs
- assumptions
- files changed
- remaining mismatch between the spec and the UI
