# JourneyPoint Frontend Guidance

This file summarizes the absorbed company frontend rules in JourneyPoint's real
stack. Normalize older external notes to Next.js 16 App Router and
`antd-style`; do not copy legacy `pages/`, `getServerSideProps`,
`getStaticProps`, or Tailwind-first guidance literally when it conflicts with
this repo.

## Architecture

- Use Next.js App Router route segments under `journeypoint/app/`.
- Use provider-based state for stateful feature modules.
- Use typed interfaces, DTO adapters, and constants where needed.
- Use Ant Design for UI components.
- Use `antd-style` for styling.

## Rules

- No inline styling.
- No untyped `any`.
- Keep components composable, typed, and accessible.
- Prefer functional components over classes.
- Put side effects in providers, hooks, or route-level orchestration, not
  presentational components.
- Reuse constants, helpers, and utilities before adding duplicate literals.
- Ignore the `angular/` application.
- Keep provider modules on the strict four-file contract only:
  `actions.tsx`, `context.tsx`, `index.tsx`, and `reducer.tsx`.
- Keep bootstrap, auth/session restoration, and other cross-cutting side
  effects outside provider folders unless the provider contract explicitly
  allows them.
- Do not declare regular nested React components inside other functional
  component bodies; extract them into `components/` or another dedicated
  module.
- Keep component files PascalCase and non-component files aligned to the
  documented project conventions.
- Prefer early returns and small readable functions over deep nesting.
- Prefer simple code over premature memoization.
- Use `next/image` and dynamic imports intentionally where they materially
  improve UX or delivery.

## Auth and tenancy

- Preserve host vs tenant auth behavior.
- Any change affecting auth must respect the existing tenant resolution flow.
