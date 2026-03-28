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
- Place DTOs next to their app services, not in the domain layer.
- Add XML comments to public backend classes and public methods.
- Use audited ABP entity bases for new product entities and preserve tenant
  ownership as a core invariant.
- New product entities should default to `FullAuditedEntity<Guid>` unless a
  higher-priority spec explicitly records a different key strategy.
- Use data annotations for entity validation and relationship hints instead of
  manual validation code inside entity bodies.
- Put aggregate and cross-entity business rules into Core domain services or
  managers, not into entity method bodies.
- Prefer small focused classes and methods, guard clauses, explicit enums or
  constants instead of magic numbers, and no abbreviation-heavy naming.

## Style

- Prefer small focused services.
- Use explicit method names.
- Add XML documentation to public methods.
- Keep business rules centralized.
