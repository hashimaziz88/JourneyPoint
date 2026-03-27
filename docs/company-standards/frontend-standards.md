# Frontend Standards

These frontend rules are normalized from the supplied company frontend and
TypeScript standards and adapted to JourneyPoint's current stack.

## Architecture

- Use the Next.js App Router already established in this repo
- Keep reusable UI in `components/`
- Keep shared stateful features in `providers/`
- Keep shared values in `constants/`
- Keep shared helpers in `utils/` or `helpers/`
- Keep shared types in `types/`

## Provider Contract

- Every provider must use the strict four-file structure:
  - `actions.tsx`
  - `context.tsx`
  - `index.tsx`
  - `reducer.tsx`
- Do not add extra files inside provider folders for bootstrap or side effects
- Put bootstrap, auth/session restoration, and similar orchestration outside the
  provider folder

## Component Rules

- Do not declare regular child React components inside other functional
  component bodies
- Keep components composable and presentational where practical
- Keep side effects in providers, hooks, or dedicated orchestration components
- Use PascalCase filenames for React component files
- Do not use inline styles
- Do not use untyped `any`

## Styling

- JourneyPoint uses Ant Design plus `antd-style`; follow that stack rather than
  importing Tailwind-specific guidance literally
- Keep styling in dedicated `style.ts` files or existing `antd-style` patterns
- Prefer reusable constants and styles over duplicated literals
- Do not use inline styles
