# Employees Manager (AB InBev Tech Test)

This project is a full-stack employee management system developed as a technical test for AB InBev. It includes a frontend built with Angular, a backend built with .NET, and a PostgreSQL database running in Docker.

## Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (Recommended: LTS version)
-   [Angular CLI](https://angular.io/cli)
-   [.NET SDK](https://dotnet.microsoft.com/en-us/download)
-   [Docker](https://www.docker.com/)
-   [Docker Compose](https://docs.docker.com/compose/)

## Running the Entire Application with Docker

To run the entire application in containers:

```sh
docker compose up --build -d
```

### Accessing the apps

-   Frontend application: http://localhost:3000
-   API Swagger: http://localhost:5058/swagger

## Local Development Setup

### 1. Database (Docker)

Start the database container:

```sh
docker compose up db --build -d
```

### 2. Backend

Navigate to the backend directory and start the server:

```sh
cd backend/Backend
dotnet run --launch-profile https
```

The database setup must be completed for the backend to function properly.

### 3. Frontend

Navigate to the frontend directory and start the Angular development server:

```sh
cd frontend
npm install
npm run start
```

### Accessing the apps

-   Frontend application: http://localhost:4200
-   API Swagger: http://localhost:7131/swagger

Connecting to the database:

-   Host: localhost
-   Port: 5432
-   Database name: employee_management
-   User: admin
-   Password: admin123

## Running Tests

### Backend Tests (xUnit)

```sh
cd backend/Backend.Tests
dotnet test
```

### Frontend Tests (Jest/Karma)

```sh
cd frontend
npm run test
```

## Tech Stack

-   **Frontend:** Angular 19, TypeScript, PrimeNG, Tailwind, RxJS
-   **Backend:** .NET 9, ASP.NET Core, Entity Framework Core
-   **Database:** PostgreSQL (Docker)
-   **Authentication:** JWT
-   **Testing:** xUnit for .NET, Jest for Angular
-   **Containerization:** Docker & Docker Compose

## Commit Message Convention (Semantic Commits)

This project follows **semantic commits** with specific contexts:

-   `feat(frontend): add login component`
-   `refactor(frontend): remove business logic from controller`
-   `fix(backend): correct password hash verification`
-   `chore(frontend): update dependencies`
-   `test(backend): add unit tests for AuthService`
-   `docs: update README`

## Author

-   **João Mussi Gotardelo**
-   [LinkedIn](https://www.linkedin.com/in/joao-mussi-gotardelo/)
-   [GitHub](https://github.com/JoaoMussi)
