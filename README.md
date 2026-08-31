# Skillz

**Find your perfect project team.**

Skillz is a platform designed to help developers, designers, and creators find teammates for hackathons, open-source projects, startups, or just for learning. By matching people based on skills, interests, and availability, Skillz makes team formation seamless.

## Tech Stack
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Frontend**: React (planned) .

## Prerequisites

Before running the project locally, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher) running locally or remotely

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd skillZ
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   In the `backend` directory, create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Note: Update the `DATABASE_URL` in `.env` with your actual PostgreSQL credentials.*

4. **Initialize the Database**:
   Run Prisma migrations to create the tables, then seed the initial data:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## Project Structure
- `/backend`: Node.js + Express API
  - `/backend/prisma`: Prisma schema and seed scripts
  - `/backend/src`: Source code (routes, controllers, services)
- `/docs`: Architecture, API, and Database documentation
- `/frontend`: (Coming soon)

## Development Phases
- **Phase 1**: Database schema, auth, basic profiles, onboarding API.
- **Phase 2**: Projects, matching logic, and team formation.
- **Phase 3**: Messaging, notifications, and dashboard.

## Contributing
1. Create a feature branch (`git checkout -b feature/my-feature`)
2. Commit your changes (`git commit -m "Add some feature"`)
3. Push to the branch (`git push origin feature/my-feature`)
4. Open a Pull Request
