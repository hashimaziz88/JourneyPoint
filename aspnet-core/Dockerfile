# -----------------------
# BUILD STAGE
# -----------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore src/JourneyPoint.Web.Host/JourneyPoint.Web.Host.csproj
RUN dotnet publish src/JourneyPoint.Web.Host/JourneyPoint.Web.Host.csproj -c Release -o /app/publish


# -----------------------
# RUNTIME STAGE
# -----------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

COPY --from=build /app/publish .

# 🔥 REQUIRED FOR RENDER
ENV ASPNETCORE_URLS=http://+:${PORT}
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "JourneyPoint.Web.Host.dll"]