# JourneyPoint

[![Backend CI](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/frontend-ci.yml/badge.svg?branch=main)](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/frontend-ci.yml)

## What is JourneyPoint?

JourneyPoint is a multi-tenant onboarding platform designed to transform the way organisations onboard new hires. With a structured and data-driven approach, our application empowers facilitators to create reusable onboarding plans, enrol new hires into personalised journeys, and track engagement and completion throughout the onboarding lifecycle.

## Why Choose JourneyPoint?

Structured Onboarding: We provide facilitators with the tools to build reusable plan templates with modules and tasks, automatically generating personalised journey plans for each new hire.

AI-Assisted Enrichment: Facilitators can upload documents such as PDFs, images, and markdown files to have Groq extract structured onboarding content — with full human review before anything is applied.

Engagement Monitoring: JourneyPoint tracks hire progress through composite engagement scores, classification labels, and active at-risk flags, enabling early facilitator intervention when a hire is falling behind.

Multi-Tenant Isolation: Each organisation operates in complete isolation — tenants see only their own data, users, and plans, with no cross-tenant data leakage.

Role-Aware Workflows: Facilitator, Manager, and Enrolee views each have purpose-built dashboards and task flows tailored to their responsibilities within the onboarding process.

## Documentation

### Software Requirement Specification

#### Speccification Document

[View Spec Document](https://drive.google.com/file/d/16LNdBIP9ijmweslzHh5AwktbE43vlcyE/view?usp=sharing)

#### Overview

JourneyPoint is a multi-tenant onboarding platform designed to transform the way organisations onboard new hires. With a structured and data-driven approach, our application empowers facilitators to create reusable onboarding plans, enrol new hires into personalised journeys, and track engagement and completion throughout the onboarding lifecycle.

#### Components and Functional Requirements

##### 1. Authentication and Authorisation Management

- User can log into the JourneyPoint web application
- User can access their role-specific dashboard after login
- Admin can create and manage user accounts across tenants

##### 2. Plan Management

- Facilitator can create and edit onboarding plan templates
- Facilitator can add, edit, and remove modules within a plan
- Facilitator can add, edit, and remove tasks within a module
- Facilitator can import plan content from uploaded documents (PDF, image, markdown)
- Facilitator can use AI-assisted enrichment to extract structured content from documents

##### 3. Hire Management

- Facilitator can create a new hire record
- System automatically creates a platform user account and sends a welcome email with temporary credentials upon hire creation
- Facilitator can view and manage all hires on a pipeline board
- Facilitator can view detailed hire information including lifecycle status

##### 4. Journey Management

- Facilitator can generate a personalised journey plan for a hire from a selected plan template
- Facilitator can review and edit draft journey tasks before activation
- Facilitator can add draft tasks to a generated journey
- Facilitator can activate a journey to make it visible to the hire
- Enrolee can view their active journey and complete assigned tasks
- Manager can view direct report task workspaces

##### 5. Engagement and Intervention

- System tracks hire engagement and calculates a composite engagement score
- Facilitator can view score trend charts and engagement snapshots
- Facilitator can raise an at-risk flag for a hire showing signs of disengagement
- Facilitator can resolve an at-risk flag and record an intervention
- Facilitator can view full intervention history per hire

##### 6. Notification Management

- System sends a welcome email with temporary credentials when a hire account is created
- Facilitator can see the status of welcome notification delivery per hire

##### 7. Multi-Tenancy

- Platform supports multiple isolated tenant organisations
- Tenant admin can manage users within their own tenant
- All data is fully isolated per tenant

## Design

### Wireframes

[View Figma Designs](https://www.figma.com/make/5T4QDMFiOFLpOOPql1HhXN/JourneyPoint)

### Domain Model

[View Domain Model Online](https://drive.google.com/file/d/1kv56O3XnyTrqi7bkaZcj1aX3mcpPtyru/view?usp=sharing)
![Domain Model](docs/diagrams/JourneyPoint-domain-model.png)

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
npm run start
```

Refer to [journeypoint/README.md](journeypoint/README.md) for more detailed instructions to run the frontend.

### Backend

```bash
# Configure connection string and secrets in:
# aspnet-core/src/JourneyPoint.Web.Host/appsettings.json

# Apply database migrations
dotnet run --project aspnet-core/src/JourneyPoint.Migrator

# Start the API server (Swagger available after start)
dotnet run --project aspnet-core/src/JourneyPoint.Web.Host
```

Refer to [aspnet-core/README.md](aspnet-core/README.md) for more detailed instructions to run the backend.

### Frontend CI

```bash
npm run lint
npm run build
npm run test:e2e
```
