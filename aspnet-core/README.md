# JourneyPoint — Backend

[![Backend CI](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/backend-ci.yml)

## What is the JourneyPoint Backend?

The JourneyPoint backend is a REST API built on ABP Framework 9.4.1 and .NET 8. It handles all business logic, data persistence, AI-assisted content enrichment, wellness tracking, and multi-tenant isolation for the JourneyPoint onboarding platform.

## Why This Stack?

ABP Framework: Provides multi-tenancy, audit logging, role-based authorisation, and dependency injection out of the box, reducing boilerplate and enforcing consistent architecture across all features.

PostgreSQL with EF Core: A battle-tested combination that provides reliable relational storage, strong migration tooling, and full support for ABP's tenant-aware repository pattern.

Groq AI — Backend Only: All AI calls are made from the backend exclusively. The frontend never calls an AI provider directly, ensuring enrichment results are auditable and facilitator-approved before any data is changed.

## Documentation

### Software Requirement Specification

#### Overview

The backend exposes a secure JWT-authenticated REST API consumed by the Next.js frontend. It enforces multi-tenant data isolation, orchestrates AI enrichment workflows, manages wellness check-in scheduling and AI question generation, and handles file storage for plan documents.

#### Components and Functional Requirements

##### 1. Authentication and Authorisation

- API accepts JWT Bearer tokens issued by the TokenAuth endpoint
- Role-based authorisation enforced via `[AbpAuthorize]` on all application services
- Supports Facilitator, Manager, Enrolee, and Admin roles

##### 2. Plan Management

- Create, read, update, and delete plan templates
- Manage modules and tasks within a plan
- Accept uploaded documents (PDF, image, markdown) and store them per tenant
- Trigger AI enrichment via Groq to extract structured content from uploaded documents
- Return a diff of proposed changes for facilitator review before applying

##### 3. Hire Management

- Create hire records with full personal and role details
- Automatically generate a platform user account and temporary password on hire creation
- Dispatch welcome email with temporary credentials via SMTP when mail delivery is enabled
- Track welcome notification delivery status (Pending/Sent/Failed) on the Hire entity
- Support pipeline board queries filtered by hire status

##### 4. Journey Management

- Generate a personalised journey from a selected plan template for a given hire
- Expose draft journey tasks for facilitator review and editing
- Support adding, editing, and removing draft tasks before activation
- Activate a journey to make it accessible to the hire and manager
- Track task completion and module progress per hire

##### 5. Engagement and Intervention

- Record engagement snapshots with composite scores and classification labels
- Expose score trend history for chart rendering on the frontend
- Create and resolve at-risk flags with structured intervention records
- Return full intervention history per hire

##### 6. Wellness Tracking

- Generate scheduled wellness check-ins at key milestones when a journey is activated
- Use Groq AI to generate tailored wellness questions per check-in period
- Accept and persist hire answers and AI-suggested draft answers
- Submit completed check-ins and generate AI insight summaries
- Expose hire wellness overview and check-in detail endpoints for Facilitator, Manager, and Enrolee roles
- Return hire context (name, role, department, start date) alongside wellness data

##### 7. Multi-Tenancy

- All entities are tenant-scoped via ABP Zero tenant filters
- Tenant resolution is automatic — never bypassed
- Demo tenants Boxfusion and DeptDemo are seeded on first migration

## Design

### Solution Structure

```text
aspnet-core/
├── src/
│   ├── JourneyPoint.Core                     # Domain layer
│   │   ├── Authorization/                    # Permissions, roles, users
│   │   ├── Domains/
│   │   │   ├── Audit/                        # Audit log entities
│   │   │   ├── Engagement/                   # Engagement scores, at-risk flags, interventions
│   │   │   ├── Hires/                        # Hire entity, lifecycle state machine, notifications
│   │   │   ├── OnboardingPlans/              # Plan, module, task aggregate
│   │   │   └── Wellness/                     # Wellness check-in, question, period entities
│   │   ├── Configuration/                    # Mail and Groq option classes
│   │   └── Localization/                     # Resource files
│   │
│   ├── JourneyPoint.Application              # Application layer
│   │   ├── Services/
│   │   │   ├── AuditService/                 # Audit log queries
│   │   │   ├── DocumentExtractionService/    # AI content extraction from documents
│   │   │   ├── EngagementService/            # Engagement scores and interventions
│   │   │   ├── FileStorageService/           # Tenant-scoped file persistence
│   │   │   ├── GroqService/                  # Groq AI integration (all AI calls)
│   │   │   ├── HireService/                  # Hire enrolment and account provisioning
│   │   │   ├── JourneyService/               # Journey generation, activation, task tracking
│   │   │   ├── MarkdownImportService/        # Markdown plan import and parsing
│   │   │   ├── NotificationService/          # Welcome email dispatch via SMTP
│   │   │   ├── OnboardingDocumentService/    # Document upload and AI enrichment review
│   │   │   ├── OnboardingPlanService/        # Plan CRUD and lifecycle (Draft/Published/Archived)
│   │   │   └── WellnessService/              # Wellness check-in scheduling and AI questions
│   │   ├── Sessions/                         # Current user/tenant session info
│   │   └── Users/                            # User management
│   │
│   ├── JourneyPoint.EntityFrameworkCore       # Persistence layer
│   │   ├── EntityFrameworkCore/
│   │   │   ├── Configurations/               # EF Fluent API entity configuration
│   │   │   ├── Repositories/                 # Custom repository implementations
│   │   │   └── Seed/                         # Demo tenant and data seeding
│   │   └── Migrations/                       # EF Core migration files
│   │
│   ├── JourneyPoint.Web.Core                 # API plumbing
│   │   ├── Authentication/                   # JWT Bearer and external auth
│   │   └── Controllers/                      # API controller base classes
│   │
│   ├── JourneyPoint.Web.Host                 # Hosting
│   │   ├── Startup/                          # DI configuration, middleware, options validation
│   │   └── Controllers/                      # HomeController (health check only)
│   │
│   └── JourneyPoint.Migrator                 # Database migration console app
│
└── test/
    ├── JourneyPoint.Tests                    # Domain and application service tests
    └── JourneyPoint.Web.Tests                # API integration tests
```

### Domain Model

[View Domain Model Online](https://drive.google.com/file/d/1kv56O3XnyTrqi7bkaZcj1aX3mcpPtyru/view?usp=sharing)
![Domain Model](../docs/diagrams/JourneyPoint-domain-model.png)

## Running the Application

### Prerequisites

- .NET 8 SDK
- PostgreSQL 15+ running locally or remotely
- Groq API key for AI enrichment features
- (Optional) SMTP credentials for welcome email delivery, or Mailpit running locally for email interception

### Configuration

Edit `src/JourneyPoint.Web.Host/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost; Port=5432; Database=journeypointdb; Username=postgres; Password=yourpassword;"
  },
  "App": {
    "ServerRootAddress": "https://localhost:44311/",
    "ClientRootAddress": "http://localhost:3000/",
    "CorsOrigins": "http://localhost:3000"
  },
  "Authentication": {
    "JwtBearer": {
      "IsEnabled": "true",
      "SecurityKey": "YOUR_JWT_SECRET_KEY_MIN_32_CHARS",
      "Issuer": "JourneyPoint",
      "Audience": "JourneyPoint"
    }
  },
  "Groq": {
    "Enabled": true,
    "ApiKey": "YOUR_GROQ_API_KEY",
    "Model": "llama-3.3-70b-versatile",
    "VisionModel": "meta-llama/llama-4-scout-17b-16e-instruct",
    "TimeoutSeconds": 300
  },
  "Mail": {
    "Enabled": true,
    "Provider": "Smtp",
    "FromAddress": "no-reply@yourdomain.com",
    "FromDisplayName": "JourneyPoint",
    "SmtpHost": "in-v3.mailjet.com",
    "SmtpPort": 587,
    "UseSsl": false,
    "UserName": "YOUR_MAILJET_API_KEY",
    "Password": "YOUR_MAILJET_SECRET_KEY"
  }
}
```

For local development use Mailpit (`SmtpHost: localhost`, `SmtpPort: 1025`).

### Apply Migrations

```bash
dotnet run --project src/JourneyPoint.Migrator
```

### Start the API

```bash
dotnet run --project src/JourneyPoint.Web.Host
```

Swagger UI is available at `https://localhost:44311/swagger` after startup.

### Run Tests

```bash
dotnet test test/JourneyPoint.Tests/JourneyPoint.Tests.csproj
dotnet test test/JourneyPoint.Web.Tests/JourneyPoint.Web.Tests.csproj
```

### Add a Migration

```bash
dotnet ef migrations add <MigrationName> --project src/JourneyPoint.EntityFrameworkCore
```

### Docker

```bash
docker build -f src/JourneyPoint.Web.Host/Dockerfile -t journeypoint-api .
docker run -p 44311:44311 journeypoint-api
```
