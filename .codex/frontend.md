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

## Auth and tenancy

- Preserve host vs tenant auth behavior.
- Any change affecting auth must respect the existing tenant resolution flow.
