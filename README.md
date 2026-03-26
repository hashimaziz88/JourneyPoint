# JourneyPoint

Multi-tenant onboarding platform for reusable onboarding plans, hire journeys,
AI-assisted enrichment, and engagement tracking.

## Delivery Baseline

Current implementation planning is governed by the active Spec Kit package in
`specs/001-journeypoint-platform/` and its five-milestone roadmap in
`specs/001-journeypoint-platform/github-roadmap.md`.

Any pre-existing GitHub milestone or issue language that references Angular is
historical foundation context only and does not define the current JourneyPoint
roadmap.

## Monorepo Structure

```
JourneyPoint/
  aspnet-core/      # .NET 8 backend (ABP Framework)
  journeypoint/     # Next.js 16 frontend
  angular/          # Legacy Angular frontend kept only as local reference
```

## Quick Start

### Backend

```bash
cd aspnet-core
# Configure connection string in src/JourneyPoint.Web.Host/appsettings.json
dotnet run --project src/JourneyPoint.Migrator        # Apply migrations
dotnet run --project src/JourneyPoint.Web.Host        # Start API (https://localhost:44311)
```

### Frontend

```bash
cd journeypoint
npm install
npm run dev       # http://localhost:3000
```

## Architecture

The backend exposes a REST API secured with JWT. The Next.js frontend consumes
it via Axios, configured through `NEXT_PUBLIC_API_BASE_URL`.

Planning and implementation intent live in the active JourneyPoint Spec Kit
artifacts rather than legacy GitHub milestone names.

See each directory's own `README.md` for detailed setup and structure.
