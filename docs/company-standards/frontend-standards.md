# Frontend Standards

These frontend rules absorb the supplied company Next.js, TypeScript, and
provider-pattern standards and normalize them to JourneyPoint's actual stack:
Next.js 16 App Router, React 19, TypeScript, Ant Design, and `antd-style`.

## Normalization Notes

- Treat App Router guidance as authoritative for JourneyPoint. Older
  `pages/`, `getServerSideProps`, and `getStaticProps` references from legacy
  company notes map to App Router route segments, server components, route
  handlers, cache controls, and `revalidate` behavior instead.
- Treat `antd-style` as authoritative for JourneyPoint styling. Tailwind-first
  advice from older notes is informative but not binding in this repository.
- Treat current TypeScript and React conventions as authoritative. Older
  JavaScript-era requirements such as blanket `"use strict"` headers,
  region-heavy class structure, or imperative style are not copied literally
  when they conflict with modern module, lint, or framework conventions.

## Architecture

- Use the Next.js App Router only.
- Keep feature routes under `journeypoint/app/`.
- Keep shared UI in `journeypoint/components/`.
- Keep stateful feature modules in `journeypoint/providers/`.
- Keep shared values in `journeypoint/constants/`.
- Keep shared helpers in `journeypoint/utils/` or `journeypoint/helpers/`.
- Keep shared types in `journeypoint/types/`.
- Ignore `angular/` for current JourneyPoint work.

## Provider Contract

Every stateful frontend feature must use this exact provider structure:

```text
providers/<feature>Provider/
  actions.tsx
  context.tsx
  index.tsx
  reducer.tsx
```

- Do not add extra provider-local files for bootstrap, polling, or auth/session
  restoration.
- Put cross-cutting orchestration outside provider folders.
- Keep provider actions typed end to end.
- Keep provider state and action contexts explicit rather than loosely shaped.
- Preserve tenant and auth behavior in provider actions; do not bypass the
  existing proxy, cookie, or tenant-resolution flow.

## Component and Page Rules

- Prefer functional components over classes.
- Keep components small, composable, and readable.
- Do not declare regular nested React components inside other component bodies.
- Keep presentational components focused on rendering; move orchestration into
  providers, hooks, or route-level composition.
- Keep state as close as practical to where it is used.
- Prefer early returns over deep nesting.
- Prefer clear code over speculative optimisation.
- Use PascalCase filenames for React component files.
- Use kebab-case or established repo conventions for non-component files.
- Name exported components before `export default`.

## Styling

- Use `antd-style` for component and page styling.
- Keep styles in dedicated style modules that match existing repo patterns.
- Do not use inline styles.
- Do not hardcode ad hoc visual tokens when a shared token, theme value, or
  reusable style constant should exist.
- Preserve responsive behavior across desktop and mobile.
- Use `next/image` when image optimization is relevant.

## TypeScript Rules

- Do not use untyped `any`.
- Prefer explicit interfaces and named types for API contracts and provider
  state.
- Use `unknown` instead of `any` when a boundary is temporarily uncertain.
- Avoid non-null assertions unless the invariant is clear at that exact call
  site.
- Keep boolean prop names descriptive, such as `isLoading`, `isDisabled`, or
  `hasError`.

## React and Next.js Practices

- Prefer App Router idioms over legacy Pages Router APIs.
- Use server components by default when interactivity is not required.
- Add `"use client"` only where client behavior is actually needed.
- Use dynamic imports when they materially reduce initial client cost or avoid
  loading non-critical UI too early.
- Use caching and revalidation intentionally for read flows; do not add random
  client fetches where server rendering or cached data would be cleaner.
- Handle loading, empty, and error states explicitly.
- Keep accessibility in scope for interactive controls, headings, labels,
  keyboard behavior, and semantic structure.

## Dependency Rules

- Minimize third-party dependencies.
- Prefer existing repo patterns and utilities before introducing new packages.
- Do not add trivial dependencies that can be implemented simply in-house.
- Consider bundle size and long-term maintenance before adding frontend
  packages.

## Performance Guidance

- Avoid premature memoization.
- Use `React.memo`, `useMemo`, and `useCallback` only when a measured rendering
  or recomputation problem justifies them.
- Prefer fixing slow renders before chasing rerender micro-optimizations.
- Split code with `dynamic()` only when it improves delivery meaningfully.

## Documentation and Maintainability

- Public reusable modules, exported interfaces, and non-obvious logic should be
  documented clearly enough for another contributor to continue the work.
- New frontend work must align with the active spec package, project guide, and
  agent guidance.
- Older repo code that predates these rules does not justify repeating older
  patterns in new work.
