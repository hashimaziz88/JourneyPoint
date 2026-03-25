# JourneyPoint

HR management platform for employee data and performance tracking.

## Monorepo Structure

```
JourneyPoint/
  aspnet-core/      # .NET 8 backend (ABP Framework)
  journeypoint/     # Next.js 16 frontend
  angular/          # Angular frontend (reference locally, not deployed)
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

The backend exposes a REST API secured with JWT. The Next.js frontend consumes it via Axios, configured through `NEXT_PUBLIC_API_BASE_URL`.

See each directory's own `README.md` for detailed setup and structure.
