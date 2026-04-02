# JourneyPoint — Frontend

[![Frontend CI](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/frontend-ci.yml/badge.svg?branch=main)](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/frontend-ci.yml)

## What is the JourneyPoint Frontend?

The JourneyPoint frontend is a Next.js 16 application built with React 19 and TypeScript 5. It provides role-aware dashboards and workflows for Facilitators, Managers, and Enrolees, consuming the JourneyPoint REST API to drive the full onboarding lifecycle including journey management, engagement monitoring, and wellness tracking.

## Why This Stack?

Next.js App Router: Server and client components, nested layouts, and route groups allow clean role-based navigation without duplicating layout logic or relying on client-side-only routing.

Ant Design with antd-style: A production-grade UI component library paired with CSS-in-JS via `createStyles` gives access to the full Ant Design token system for consistent, themeable styling without any inline styles or Tailwind.

TypeScript 5: Strict typing across all components, providers, and API boundaries ensures correctness and makes refactoring safe at scale.

Playwright: End-to-end tests run against the real application in CI, catching integration regressions that unit tests cannot surface.

## Documentation

### Software Requirement Specification

#### Overview

The frontend provides three role-specific experiences — Facilitator, Manager, and Enrolee — each with dedicated route groups, dashboards, and workflows. All state management follows a strict four-file provider contract. No AI calls are made from the frontend under any circumstances.

#### Components and Functional Requirements

##### 1. Authentication

* User can log in with username and password
* JWT token is stored and used for all subsequent API requests
* Protected routes redirect unauthenticated users to the login page
* Role-based route protection redirects users to their appropriate dashboard

##### 2. Facilitator Workflow

* Facilitator can view a dashboard summarising all hires and their statuses
* Facilitator can view hires on a pipeline board grouped by status
* Facilitator can open a hire detail view showing lifecycle, journey status, and engagement data
* Facilitator can navigate to journey review to inspect, edit, and activate a hire's journey
* Facilitator can add and remove draft tasks before activating a journey
* Facilitator can view engagement score trends and intervention history per hire
* Facilitator can raise and resolve at-risk flags for hires
* Facilitator can view a live pipeline snapshot with summary statistics on the dashboard
* Facilitator can review wellness check-in responses and AI insight summaries per hire

##### 3. Manager Workflow

* Manager can view a task workspace for their direct reports
* Manager can see task completion and overdue task counts per report
* Manager can view wellness check-ins for their assigned hires

##### 4. Enrolee Workflow

* Enrolee can view their active onboarding journey
* Enrolee can see module and task progress
* Enrolee can mark tasks as complete
* Enrolee can answer scheduled wellness check-in questions
* Enrolee can request AI-generated answer suggestions for wellness questions
* Enrolee can submit completed wellness check-ins

##### 5. Plan Management

* Facilitator can import onboarding content from markdown documents
* Facilitator can review AI-extracted content diffs before applying changes to a plan

##### 6. Wellness Tracking

* Wellness check-in overview displays hire context (name, role, department, start date)
* Check-in detail view shows hire identity alongside scheduled date and period label
* Facilitator and Manager wellness views are read-only
* Enrolee wellness views support answering, AI suggestion, and submission

#### Architecture

```text
journeypoint/
├── app/
│   ├── (auth)/                # Login and authentication pages
│   ├── (facilitator)/         # Facilitator route group
│   ├── (manager)/             # Manager route group
│   ├── (enrolee)/             # Enrolee route group
│   ├── api/                   # Next.js API routes (proxy layer)
│   └── dashboard/             # Post-login dashboard redirect
├── components/                # Shared reusable React components
│   ├── admin/                 # Tenant and user admin views
│   ├── auth/                  # Login form and auth UI
│   ├── engagement/            # Engagement scores, at-risk, interventions
│   ├── facilitator/           # Facilitator dashboard
│   ├── hires/                 # Hire cards, list, detail, form
│   ├── journey/               # Journey review, task workspace
│   ├── layout/                # Navigation, shell, sidebar
│   ├── pipeline/              # Pipeline board and columns
│   ├── plans/                 # Plan editor, modules, import, documents
│   ├── spinner/               # Shared loading spinner
│   └── wellness/              # Wellness check-in views and cards
├── constants/                 # Enum labels, filter defaults, route maps
├── hoc/                       # Higher-order components (withAuth)
├── hooks/                     # Custom React hooks (useAppSession, etc.)
├── layout/                    # App-level layout shell
├── layouts/                   # Role-specific layout wrappers
├── providers/                 # Stateful feature providers (four-file contract)
│   ├── authProvider/
│   ├── engagementProvider/
│   ├── hireProvider/
│   ├── journeyProvider/
│   ├── markdownImportProvider/
│   ├── onboardingDocumentProvider/
│   ├── onboardingPlanProvider/
│   ├── pipelineProvider/
│   ├── roleProvider/
│   ├── tenantProvider/
│   ├── userProvider/
│   └── wellnessProvider/
├── routes/                    # Route definitions and builders
├── types/                     # TypeScript type definitions per domain
├── utils/                     # Helpers and API utilities per domain
└── tests/                     # Playwright e2e tests
```

## Design

### Wireframes

[View Figma Designs](https://www.figma.com/make/5T4QDMFiOFLpOOPql1HhXN/JourneyPoint)

### Domain Model

Placeholder — link to be added.

## Running the Application

### Frontend

```bash
npm install
```

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env` file in the `journeypoint/` directory:

```bash
API_BACKEND_URL="https://localhost:44311"
NEXT_PUBLIC_API_BASE_URL="https://localhost:44311"
```

### Frontend CI

```bash
npm run lint
npm run build
npm run test:e2e
```
