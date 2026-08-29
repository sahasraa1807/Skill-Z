# Skillz Architecture Overview

## Tech Stack
- **Frontend**: React (Next.js or Vite to be decided), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)

### Rationale
- **Node.js + Express**: Provides a lightweight, fast, and unopinionated backend that pairs perfectly with a JavaScript/TypeScript frontend.
- **PostgreSQL + Prisma**: Relational data models are ideal for user profiles, skills, and matches. Prisma provides best-in-class TypeScript safety and developer experience.
- **JWT**: Stateless, easily scalable authentication that works well with SPAs (Single Page Applications).

## Backend Layered Architecture

The backend will follow a standard controller-service layered architecture:

1. **Routes (`/src/routes`)**: Define API endpoints and map them to controllers. Middleware (like Auth and Validation) is applied here.
2. **Controllers (`/src/controllers`)**: Handle HTTP requests, extract parameters/body, call the service layer, and format the HTTP response.
3. **Services (`/src/services`)**: Contain the core business logic. They interact with the database via Prisma and perform complex operations.
4. **Data Access (Prisma)**: Abstracted by Prisma Client (`/src/config/prisma.js`), providing a clean API to interact with PostgreSQL.

## Frontend to Backend Connection

- **Client**: Axios will be used for making HTTP requests from the frontend to the backend API.
- **State**: React Context or Zustand for global state (e.g., current user, theme).
- **Authentication Flow**: 
  1. User logs in/registers.
  2. Backend validates and returns a JWT.
  3. Frontend stores the JWT (in memory or localStorage) and attaches it to the `Authorization: Bearer <token>` header of subsequent Axios requests.

## Phase Roadmap

- **Phase 1 (Current)**: Foundation. Database setup, Prisma schema, auth endpoints, basic user profiles, and onboarding.
- **Phase 2**: Core Features. Project creation, team building, filtering/matching users based on skills and goals.
- **Phase 3**: Engagement. Real-time messaging, notifications, and user dashboard.
