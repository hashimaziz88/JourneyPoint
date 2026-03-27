# Backend Standards

These backend rules are normalized from the supplied company backend standards
and apply to JourneyPoint's ASP.NET Boilerplate stack.

## Structure

- Keep ABP layering strict:
  - `JourneyPoint.Core` for entities, enums, domain rules, and domain services
  - `JourneyPoint.Application` for DTOs and AppServices
  - `JourneyPoint.EntityFrameworkCore` for persistence and migrations
  - `JourneyPoint.Web.Core` and `JourneyPoint.Web.Host` for web plumbing only
- Put product-domain entities under
  `aspnet-core/src/JourneyPoint.Core/Domains/<DomainArea>/`
- Put DTOs next to their AppServices under
  `aspnet-core/src/JourneyPoint.Application/Services/<Feature>/Dto/`
- Keep domain logic out of AppServices except for orchestration

## Coding Rules

- Add XML comments to public classes and public methods
- Add short comments before non-obvious logic
- Prefer small, cohesive classes and methods
- Use guard clauses and early returns to reduce nesting
- Replace magic numbers with constants or enums
- Use clear names and avoid unnecessary abbreviations
- Delete dead code instead of leaving unused branches behind

## Persistence Rules

- Preserve tenant safety as a first-class invariant
- Use audited ABP entity bases for new product entities unless append-only rules
  justify a narrower audited base
- Register every new domain entity explicitly in the EF Core layer
- Keep controllers and startup code free of business logic

## Performance Rules

- Avoid loop-driven database round trips
- Prefer set-based data access where possible
- Add indexes for frequently queried columns as part of persistence work when
  justified by the feature
