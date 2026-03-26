# JourneyPoint Backend Guidance

## Architecture

- ASP.NET Boilerplate application services are the API surface.
- Domain entities and rules live in Core.
- Persistence and EF Core configuration live in EntityFrameworkCore.
- External integrations live in Infrastructure-oriented services.

## Rules

- Do not leak entities to the client.
- Use DTOs for all external contracts.
- Preserve tenant isolation.
- Keep orchestration in Application services, not controllers.
- Groq integrations must be backend-only and auditable.
- Build new product domains under `JourneyPoint.Core/Domains/` and
  `JourneyPoint.Application/Services/`.

## Style

- Prefer small focused services.
- Use explicit method names.
- Add XML documentation to public methods.
- Keep business rules centralized.
