# JourneyPoint — ASP.NET Core Backend

REST API built on **ABP Framework** with a **Domain-Driven Design** layered architecture targeting **.NET 8**, using **SQL Server** as the database.

---

## Tech Stack

| Component | Technology |
|---|---|
| Framework | ABP Framework 9.4.1 (ABP Zero) on .NET 8 |
| Database | SQL Server via Entity Framework Core 8 |
| IoC Container | Castle Windsor |
| Object Mapping | AutoMapper |
| Authentication | JWT Bearer (HS256) |
| API Docs | Swagger / OpenAPI |
| Real-Time | SignalR |
| Logging | Log4Net |
| Testing | xUnit (via ABP test helpers) |

---

## Solution Structure

```
aspnet-core/
├── src/
│   ├── JourneyPoint.Core                 # Domain Layer
│   ├── JourneyPoint.Application          # Application Service Layer
│   ├── JourneyPoint.EntityFrameworkCore  # Data Access / Infrastructure Layer
│   ├── JourneyPoint.Web.Core             # Web Infrastructure Layer
│   ├── JourneyPoint.Web.Host             # Presentation / API Host (startup project)
│   └── JourneyPoint.Migrator             # Database migration runner (console app)
├── test/
│   ├── JourneyPoint.Tests                # Unit & integration tests
│   └── JourneyPoint.Web.Tests            # Web / API tests
└── JourneyPoint.sln
```

### Dependency Direction

No layer may reference a layer above it.

```
Web.Host
  └── Web.Core
        └── Application
              ├── Core  (Domain)
              └── EntityFrameworkCore
                    └── Core  (Domain)
```

---

## Layer Breakdown

### 1. `JourneyPoint.Core` — Domain Layer

Contains all business entities, domain logic, and domain-specific services. **No dependency on any other project layer.**

```
JourneyPoint.Core/
├── Authorization/
│   ├── Roles/                        # Role definitions & seeds
│   └── Users/                        # User manager & login service
├── Configuration/                    # App configuration helpers
├── Debugging/
├── Domains/                          # Your business domain entities (add modules here)
├── Editions/
├── Features/
├── Identity/
├── Localization/
│   └── SourceFiles/                  # XML localization resource files
├── MultiTenancy/
├── Timing/
├── Validation/
└── Web/
```

#### Rules

- All entities **must** extend `FullAuditedEntity<Guid>` to get `CreationTime`, `CreatorUserId`, `LastModificationTime`, `IsDeleted`, etc. automatically.
- Use **data annotations** for property validation (`[Required]`, `[MaxLength]`, etc.).
- Domain services encapsulate logic that spans multiple entities.
- **No** EF Core, HTTP, or application-layer references allowed here.

#### Example — Entity

```csharp
public class Product : FullAuditedEntity<Guid>
{
    [Required, MaxLength(100)]
    public string Name { get; set; }

    [Required, MaxLength(500)]
    public string Description { get; set; }

    public decimal Price { get; set; }
}
```

---

### 2. `JourneyPoint.Application` — Application Service Layer

Orchestrates domain entities to fulfil use cases. Exposes **application services** consumed by the Web layer. Contains **DTOs** and **AutoMapper** profiles.

```
JourneyPoint.Application/
├── Authorization/Accounts/Dto/
├── Configuration/
├── MultiTenancy/Dto/
├── Roles/Dto/
├── Sessions/Dto/
├── Users/Dto/
└── Services/                         # One folder per domain service
    └── {EntityName}Service/
        ├── I{EntityName}AppService.cs
        ├── {EntityName}AppService.cs
        └── DTO/
```

#### Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Service interface | `I{Entity}AppService` | `IProductAppService` |
| Service class | `{Entity}AppService` | `ProductAppService` |
| DTO folder | `DTO/` inside service folder | `ProductService/DTO/` |
| DTO class | `{Entity}Dto` | `ProductDto` |

#### Rules

- Every service class **must** have a corresponding interface.
- Services extend `AsyncCrudAppService<TEntity, TDto, TPrimaryKey>` for standard CRUD, or `ApplicationService` for custom logic.
- Apply `[AbpAuthorize]` on the class or individual methods to enforce authentication/authorisation.
- DTOs must be decorated with `[AutoMap(typeof(TEntity))]`.
- DTOs must **not** expose EF navigation properties directly — flatten or nest explicitly.

#### Example — Service

```csharp
[AbpAuthorize]
public class ProductAppService
    : AsyncCrudAppService<Product, ProductDto, Guid>,
      IProductAppService
{
    public ProductAppService(IRepository<Product, Guid> repository)
        : base(repository) { }
}
```

#### Example — DTO

```csharp
[AutoMap(typeof(Product))]
public class ProductDto : EntityDto<Guid>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
}
```

---

### 3. `JourneyPoint.EntityFrameworkCore` — Data Access Layer

Implements repository interfaces using EF Core and SQL Server.

```
JourneyPoint.EntityFrameworkCore/
└── EntityFrameworkCore/
    ├── JourneyPointDbContext.cs       # Main DbContext — all DbSet<T> declarations
    ├── JourneyPointDbContextConfigurer.cs
    ├── JourneyPointDbContextFactory.cs
    ├── AbpZeroDbMigrator.cs
    ├── Repositories/
    │   └── JourneyPointRepositoryBase.cs
    ├── Seed/
    │   ├── Host/                      # Default editions, languages, settings, roles
    │   └── Tenants/
    └── Migrations/
```

#### Rules

- Every domain entity in `Domains/` **must** have a corresponding `DbSet<T>` in `JourneyPointDbContext`.
- Override `OnModelCreating` only for config that cannot use data annotations (e.g. UTC datetime conversion, composite keys).
- Inject `IRepository<TEntity, TPrimaryKey>` in services — never `DbContext` directly from the Application layer.
- Generate migrations with: `dotnet ef migrations add <Name> --project src/JourneyPoint.EntityFrameworkCore`

#### Example — DbContext

```csharp
public class JourneyPointDbContext : AbpZeroDbContext<Tenant, Role, User, JourneyPointDbContext>
{
    public DbSet<Product> Products { get; set; }
    // ... one DbSet per domain entity
}
```

---

### 4. `JourneyPoint.Web.Core` — Web Infrastructure Layer

Shared web infrastructure for the host and test projects. JWT config, external auth providers, base controllers.

```
JourneyPoint.Web.Core/
├── Authentication/
│   ├── External/                     # OAuth / social login providers
│   └── JwtBearer/
│       ├── TokenAuthConfiguration.cs # JWT signing key, issuer, audience, expiry
│       └── JwtTokenMiddleware.cs
├── Configuration/
├── Controllers/
│   └── TokenAuthController.cs        # POST /api/TokenAuth/Authenticate
├── Identity/
└── Models/TokenAuth/
```

#### Rules

- All controllers inherit from `JourneyPointControllerBase`, not `Controller` directly.
- JWT config is read from `appsettings.json` and injected via `TokenAuthConfiguration`.
- External providers implement `IExternalAuthProviderApi`.
- **No business logic here** — only plumbing.

---

### 5. `JourneyPoint.Web.Host` — API Host (Startup Project)

The runnable ASP.NET Core host. Configures middleware, DI, Swagger, CORS, and logging.

```
JourneyPoint.Web.Host/
├── Startup/
│   ├── Program.cs                    # Castle Windsor IoC bootstrapper
│   └── Startup.cs                    # ConfigureServices + Configure
├── Controllers/
│   ├── HomeController.cs             # Redirects "/" to "/swagger"
│   └── AntiForgeryController.cs
├── appsettings.json
├── appsettings.Staging.json
├── log4net.config
├── log4net.Production.config
├── Dockerfile
└── wwwroot/swagger/
```

#### Middleware Pipeline Order

1. CORS
2. ABP exception handling
3. Static files
4. Authentication (JWT)
5. Authorization
6. Routing → MVC Controllers
7. Swagger (`/swagger`)
8. SignalR (`/signalr`)

#### Rules

- **No business logic** here — forward to application services.
- Environment-specific secrets go in `appsettings.{Environment}.json`, never committed.
- CORS origins are loaded from `App:CorsOrigins` in config.

---

### 6. `JourneyPoint.Migrator` — Migration Runner

Standalone console app that applies pending EF migrations without starting the full web host.

```bash
dotnet run --project src/JourneyPoint.Migrator
```

---

## Setup

**1. Configure the database**

Edit `src/JourneyPoint.Web.Host/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost; Database=JourneyPointDb; Trusted_Connection=True;"
  },
  "Authentication": {
    "JwtBearer": {
      "SecurityKey": "<your-secret-key>",
      "Issuer": "JourneyPoint",
      "Audience": "JourneyPoint"
    }
  },
  "App": {
    "ServerRootAddress": "https://localhost:44311/",
    "ClientRootAddress": "http://localhost:3000/",
    "CorsOrigins": "http://localhost:3000,http://localhost:4200"
  }
}
```

**2. Run migrations**

```bash
dotnet run --project src/JourneyPoint.Migrator
```

**3. Start the API**

```bash
dotnet run --project src/JourneyPoint.Web.Host
```

Swagger UI: `https://localhost:44311/swagger`

---

## Adding a New Feature — Step-by-Step

### Step 1 — Domain entity (`JourneyPoint.Core`)

Create `src/JourneyPoint.Core/Domains/{ModuleName}/{EntityName}.cs`:

```csharp
public class Product : FullAuditedEntity<Guid>
{
    [Required, MaxLength(100)]
    public string Name { get; set; }

    [Required, MaxLength(500)]
    public string Description { get; set; }

    public decimal Price { get; set; }
}
```

### Step 2 — Register in DbContext (`JourneyPoint.EntityFrameworkCore`)

```csharp
public DbSet<Product> Products { get; set; }
```

### Step 3 — Create a migration

```bash
dotnet ef migrations add AddProduct --project src/JourneyPoint.EntityFrameworkCore
```

### Step 4 — DTO (`JourneyPoint.Application`)

Create `Services/ProductService/DTO/ProductDto.cs`:

```csharp
[AutoMap(typeof(Product))]
public class ProductDto : EntityDto<Guid>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
}
```

### Step 5 — Service interface

```csharp
public interface IProductAppService : IAsyncCrudAppService<ProductDto, Guid> { }
```

### Step 6 — Service implementation

```csharp
[AbpAuthorize]
public class ProductAppService
    : AsyncCrudAppService<Product, ProductDto, Guid>, IProductAppService
{
    public ProductAppService(IRepository<Product, Guid> repository)
        : base(repository) { }
}
```

ABP auto-exposes this as a REST API — no controller needed.

---

## Cross-Cutting Concerns

| Concern | How It Is Handled |
|---|---|
| Authentication | JWT Bearer via `TokenAuthController` |
| Authorisation | `[AbpAuthorize]`; role-based permissions |
| Audit Logging | `FullAuditedEntity<Guid>` on every entity |
| Soft Delete | Built into `FullAuditedEntity` via `IsDeleted` |
| Validation | Data annotations; ABP validates DTOs automatically |
| Logging | Log4Net (`log4net.config`) |
| Localisation | XML resource files in `Core/Localization/SourceFiles/` |
| Multi-Tenancy | ABP Zero; `TenantId` on every entity |
| Exception Handling | ABP global handler; consistent error envelopes |
| Dependency Injection | Castle Windsor; registered per ABP module |
| Object Mapping | AutoMapper; configured via `[AutoMap]` attribute |

---

## Scripts

```bash
dotnet build                                              # Build solution
dotnet test                                               # Run all tests
dotnet run --project src/JourneyPoint.Migrator            # Migrate + seed
dotnet run --project src/JourneyPoint.Web.Host            # Start API
dotnet ef migrations add <Name> \
  --project src/JourneyPoint.EntityFrameworkCore          # New migration
```

## Docker

```bash
docker build -f src/JourneyPoint.Web.Host/Dockerfile -t journeypoint-api .
docker run -p 44311:44311 journeypoint-api
```
