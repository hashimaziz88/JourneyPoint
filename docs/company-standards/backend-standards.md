# Backend Standards

These backend rules are normalized from the supplied company backend standards
and apply to JourneyPoint's ASP.NET Boilerplate stack.

When the source documents use another project name, folder prefix, or runtime
version, apply the structural rule to the matching JourneyPoint layer rather
than copying the literal external project name into this repo. Product behavior
and entity shape still defer to the active JourneyPoint spec package.

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
- Preserve one-way dependencies only:
  - `JourneyPoint.Web.Host` -> `JourneyPoint.Web.Core` -> `JourneyPoint.Application`
  - `JourneyPoint.Application` -> `JourneyPoint.Core`
  - `JourneyPoint.EntityFrameworkCore` -> `JourneyPoint.Core`
  - no layer may reference a layer above it

## Coding Rules

- Add XML comments to public classes and public methods
- Add short comments before non-obvious logic
- Prefer small, cohesive classes and methods
- Use guard clauses and early returns to reduce nesting
- Replace magic numbers with constants or enums
- Use clear names and avoid unnecessary abbreviations
- Delete dead code instead of leaving unused branches behind
- New product entities must extend `FullAuditedEntity<Guid>`
- Use data annotations such as `[Required]`, `[MaxLength]`, `[Range]`, and
  `[ForeignKey]` for entity property validation and relationship hints
- Move aggregate or cross-entity business rules into domain services or
  managers instead of embedding them directly into entities
- Do not add EF Core, HTTP, or application-layer references to domain entities

## Naming Conventions

- AppService interfaces use `I{Entity}AppService`
- AppService classes use `{Entity}AppService`
- DTO folders live under `Services/{Feature}/Dto/`
- DTO classes use `{Entity}Dto`
- Domain managers should use `{Aggregate}Manager` when they own domain rules

## Persistence Rules

- Preserve tenant safety as a first-class invariant
- Use audited ABP entity bases for new product entities unless append-only rules
  justify a narrower audited base
- Register every new domain entity explicitly in the EF Core layer
- Keep controllers and startup code free of business logic
- Every new domain entity must have a corresponding `DbSet<T>` in
  `JourneyPointDbContext`
- Use `OnModelCreating` and EF Core configuration classes only for persistence
  concerns that data annotations cannot express, such as table naming, enum
  conversions, composite uniqueness, and database-specific constraints
- Generate new migrations from the EntityFrameworkCore project with
  `dotnet ef migrations add <MigrationName> --project src/JourneyPoint.EntityFrameworkCore`

## Feature Workflow

1. Define the domain entity under `JourneyPoint.Core/Domains/{Module}/`
2. Register the corresponding `DbSet<T>` in `JourneyPointDbContext`
3. Add the migration from `JourneyPoint.EntityFrameworkCore`
4. Create DTOs under `JourneyPoint.Application/Services/{Feature}/Dto/`
5. Add `I{Entity}AppService`
6. Implement `{Entity}AppService` using repository injection rather than direct
   `DbContext` access

## Performance Rules

- Avoid loop-driven database round trips
- Prefer set-based data access where possible
- Add indexes for frequently queried columns as part of persistence work when
  justified by the feature
