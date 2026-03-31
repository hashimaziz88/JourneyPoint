# JourneyPoint

An HR management platform built with Next.js, React 19, and TypeScript. Provides employee data and performance tracking with a dark-themed interface built on Ant Design.

## Tech Stack

| Layer       | Technology                   |
| ----------- | ---------------------------- |
| Framework   | Next.js 16 (App Router)      |
| UI Library  | Ant Design 6 + antd-style 4  |
| Styling     | CSS-in-JS via `createStyles` |
| HTTP Client | Axios                        |
| Testing     | Playwright                   |
| Language    | TypeScript 5                 |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
  layout.tsx                  # Root layout — Geist font, AppProviders wrapper
  page.tsx                    # Landing page (composes AuthCard + LandingActions)
  providers.tsx               # Ant Design ConfigProvider with dark theme
  style.ts                    # Placeholder — styles live in components/home/
  (auth)/
    login/page.tsx            # /login route

components/
  auth/
    AuthCard.tsx              # Shared two-column card layout (branding + form slot)
    LoginForm.tsx             # Login form (username, password, remember me)
    RegisterForm.tsx          # Register form (username, email, password, confirm)
    style/style.ts            # Auth layout + form styles, autofill overrides
  home/
    LandingActions.tsx        # Landing page CTA buttons (Login / Register)
    style/style.ts            # Landing page-specific styles

constants/
  auth/
    cardTypes.ts              # AuthCardProps interface
    formTypes.ts              # LoginFieldType, RegisterFieldType
  global/
    themeSetup.ts             # Ant Design ThemeConfig (dark algorithm, token overrides)
                              # componentClasses — Tailwind class map for components

types/
  auth/
    withAuth.ts               # WithAuthOptions interface

hoc/
  withAuth.tsx                # Auth HOC — protects routes, supports role-based access

providers/
  authProvider/
    context.tsx               # Auth context (in progress)
    reducer.tsx               # Auth state reducer (in progress)
    actions.tsx               # Auth action creators (in progress)
    index.tsx                 # AuthProvider component (in progress)

utils/
  axiosInstance.tsx           # Axios instance configured from NEXT_PUBLIC_API_BASE_URL

tests/
  example.spec.ts             # Playwright E2E tests
```

## Styling Conventions

All styles use `antd-style`'s `createStyles` hook, which gives access to the Ant Design theme token system:

```ts
export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadius}px;
  `,
}));
```

- **Component styles** live alongside their component in a `style/style.ts` file
- **Token values** are defined once in `constants/global/themeSetup.ts` and flow through automatically
- **No inline styles** — all values go through `createStyles`

## Theme

Dark mode using `theme.darkAlgorithm` with a custom amber/gold primary palette:

| Token              | Value               |
| ------------------ | ------------------- |
| `colorPrimary`     | `#F59E0B` (amber)   |
| `colorSuccess`     | `#10B981` (emerald) |
| `colorError`       | `#EF4444` (red)     |
| `colorBgBase`      | `#0A0A0F`           |
| `colorBgContainer` | `#12121A`           |

## Protected Routes

Wrap any page component with `withAuth` to require authentication:

```tsx
import withAuth from "@/hoc/withAuth";

const Dashboard: React.FC = () => { ... };

// Require login
export default withAuth(Dashboard);

// Require a specific role
export default withAuth(Dashboard, { allowedRoles: ["admin"] });
```

The HOC reads `auth_token` and `user_role` from `localStorage` via `useSyncExternalStore`, redirecting to `/login` if unauthenticated or to the appropriate dashboard if the role doesn't match.

## Environment Variables

| Variable                   | Description               |
| -------------------------- | ------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API requests |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
