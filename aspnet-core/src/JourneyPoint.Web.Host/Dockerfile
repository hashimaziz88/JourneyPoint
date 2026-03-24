FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/JourneyPoint.Web.Host/JourneyPoint.Web.Host.csproj", "src/JourneyPoint.Web.Host/"]
COPY ["src/JourneyPoint.Web.Core/JourneyPoint.Web.Core.csproj", "src/JourneyPoint.Web.Core/"]
COPY ["src/JourneyPoint.Application/JourneyPoint.Application.csproj", "src/JourneyPoint.Application/"]
COPY ["src/JourneyPoint.Core/JourneyPoint.Core.csproj", "src/JourneyPoint.Core/"]
COPY ["src/JourneyPoint.EntityFrameworkCore/JourneyPoint.EntityFrameworkCore.csproj", "src/JourneyPoint.EntityFrameworkCore/"]
WORKDIR "/src/src/JourneyPoint.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/JourneyPoint.Web.Host", "src/JourneyPoint.Web.Host"]
COPY ["src/JourneyPoint.Web.Core", "src/JourneyPoint.Web.Core"]
COPY ["src/JourneyPoint.Application", "src/JourneyPoint.Application"]
COPY ["src/JourneyPoint.Core", "src/JourneyPoint.Core"]
COPY ["src/JourneyPoint.EntityFrameworkCore", "src/JourneyPoint.EntityFrameworkCore"]
WORKDIR "/src/src/JourneyPoint.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "JourneyPoint.Web.Host.dll"]
