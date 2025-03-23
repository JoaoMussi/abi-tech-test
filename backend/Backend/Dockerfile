FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /source
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .

EXPOSE 5058

ENTRYPOINT ["dotnet", "Backend.dll"]