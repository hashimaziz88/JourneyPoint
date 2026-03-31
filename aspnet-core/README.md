# JourneyPoint — Backend

[![Backend CI](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/hashimaziz88/JourneyPoint/actions/workflows/backend-ci.yml)

## What is the JourneyPoint Backend?

The JourneyPoint backend is a REST API built on ABP Framework 9.4.1 and .NET 8. It handles all business logic, data persistence, AI-assisted content enrichment, email delivery, and multi-tenant isolation for the JourneyPoint onboarding platform.

## Why This Stack?

ABP Framework: Provides multi-tenancy, audit logging, role-based authorisation, and dependency injection out of the box, reducing boilerplate and enforcing consistent architecture across all features.

PostgreSQL with EF Core: A battle-tested combination that provides reliable relational storage, strong migration tooling, and full support for ABP's tenant-aware repository pattern.

Groq AI — Backend Only: All AI calls are made from the backend exclusively. The frontend never calls an AI provider directly, ensuring enrichment results are auditable and facilitator-approved before any data is changed.

Mailjet SMTP: Transactional email for hire welcome notifications is routed through Mailjet's SMTP relay, with Mailpit available for local development interception.

## Documentation

### Software Requirement Specification

#### Overview

The backend exposes a secure JWT-authenticated REST API consumed by the Next.js frontend. It enforces multi-tenant data isolation, orchestrates AI enrichment workflows, manages file storage for plan documents, and delivers transactional email notifications.

#### Components and Functional Requirements

##### 1. Authentication and Authorisation

* API accepts JWT Bearer tokens issued by the TokenAuth endpoint
* Role-based authorisation enforced via `[AbpAuthorize]` on all application services
* Supports Facilitator, Manager, Enrolee, and Admin roles

##### 2. Plan Management

* Create, read, update, and delete plan templates
* Manage modules and tasks within a plan
* Accept uploaded documents (PDF, image, markdown) and store them per tenant
* Trigger AI enrichment via Groq to extract structured content from uploaded documents
* Return a diff of proposed changes for facilitator review before applying

##### 3. Hire Management

* Create hire records with full personal and role details
* Automatically generate a platform user account and temporary password on hire creation
* Send a welcome email with temporary credentials via the configured SMTP provider
* Track and expose welcome notification delivery status and failure reasons
* Support pipeline board queries filtered by hire status

##### 4. Journey Management

* Generate a personalised journey from a selected plan template for a given hire
* Expose draft journey tasks for facilitator review and editing
* Support adding, editing, and removing draft tasks before activation
* Activate a journey to make it accessible to the hire and manager
* Track task completion and module progress per hire

##### 5. Engagement and Intervention

* Record engagement snapshots with composite scores and classification labels
* Expose score trend history for chart rendering on the frontend
* Create and resolve at-risk flags with structured intervention records
* Return full intervention history per hire

##### 6. Notification Management

* Send welcome notification emails on hire account creation
* Record dispatch result including success status, timestamp, and failure reason
* Expose notification status per hire for facilitator visibility

##### 7. Multi-Tenancy

* All entities are tenant-scoped via ABP Zero tenant filters
* Tenant resolution is automatic — never bypassed
* Demo tenants Boxfusion and DeptDemo are seeded on first migration

#### Architecture Diagram

Placeholder — link to be added.

## Design

### Solution Structure

```text
aspnet-core/
├── src/
│   ├── JourneyPoint.Core                 # Domain entities, services, enums, permissions
│   ├── JourneyPoint.Application          # Application services, DTOs, AutoMapper profiles
│   ├── JourneyPoint.EntityFrameworkCore  # DbContext, EF configuration, migrations
│   ├── JourneyPoint.Web.Core             # API controller base classes and JWT wiring
│   ├── JourneyPoint.Web.Host             # Startup, appsettings, hosting (no business logic)
│   └── JourneyPoint.Migrator             # Database migration console app
└── test/
    ├── JourneyPoint.Tests
    └── JourneyPoint.Web.Tests
```

### Domain Model

Placeholder — link to be added.

## Running the Application

### Prerequisites

* .NET 8 SDK
* PostgreSQL 15+ running locally or remotely
* Groq API key for AI enrichment features
* Mailjet credentials, or Mailpit running locally for email interception

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
