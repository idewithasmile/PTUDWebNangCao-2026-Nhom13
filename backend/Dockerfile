FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY src/Domain/*.csproj src/Domain/
COPY src/Application/*.csproj src/Application/
COPY src/Infrastructure/*.csproj src/Infrastructure/
COPY src/Presentation/*.csproj src/Presentation/
RUN dotnet restore src/Presentation/CulinaryBlog.API.csproj

COPY . .
WORKDIR /app/src/Presentation
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "CulinaryBlog.API.dll"]
