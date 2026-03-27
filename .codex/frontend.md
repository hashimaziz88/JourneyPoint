# JourneyPoint Frontend Guidance

## Architecture

- Use Next.js App Router.
- Use provider-based state for feature modules.
- Use typed interfaces and DTO adapters where needed.
- Use Ant Design for UI components.
- Use antd-style for styling.

## Rules

- No inline styling.
- No `any`.
- Keep components composable.
- Put side effects in providers/hooks, not presentational components.
- Reuse constants and utility functions.
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

## Auth and tenancy

- Preserve host vs tenant auth behavior.
- Any change affecting auth must respect the existing tenant resolution flow.
