# Skillz Database Documentation

This document describes the Phase 1 database design for the Skillz platform.

## Architecture & Technology Choices

- **Database Engine**: PostgreSQL 14+
  - *Why?* Relational data model fits well with users, skills, and interests. PostgreSQL offers great performance, robust constraints, and good JSON support if needed later.
- **ORM**: Prisma
  - *Why?* Type-safe database access, automated migrations, declarative schema, and excellent developer experience.
- **Enums**: Used for fixed sets of values (e.g., `ExperienceLevel`, `Goal`) to ensure data integrity.
- **Cascade Deletes**: Configured for user relationships so deleting a user automatically cleans up their preferences, skills, interests, and goals.

## Schema Overview

### Enums
- `ExperienceLevel`: `BEGINNER`, `INTERMEDIATE`, `EXPERIENCED`
- `ProficiencyLevel`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- `Goal`: `PORTFOLIO`, `HACKATHON`, `LEARNING`, `OPEN_SOURCE`, `STARTUP`, `LONG_TERM`, `SHORT_TERM`

### Models

#### `User` (Table: `users`)
Core user account information.
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `username`: String (Unique)
- `passwordHash`: String
- `bio`, `location`, `avatarUrl`: Optional strings
- `onboardingCompleted`: Boolean (default: false)
- `onboardingStep`: Int (default: 0)
- `createdAt`, `updatedAt`: Timestamps

#### `UserPreferences` (Table: `user_preferences`)
1-to-1 relationship with `User`. Stores availability and links.
- `id`: UUID
- `userId`: UUID (Unique, Foreign Key to User)
- `availabilityHours`: Int (Optional)
- `preferWeekdays`, `preferWeekends`, `preferEvenings`, `preferMornings`: Booleans (default: false)
- `experienceLevel`: Enum (Optional)
- `githubUrl`, `portfolioUrl`, `linkedinUrl`: Optional strings

#### `Skill` (Table: `skills`)
Global dictionary of available skills.
- `id`: UUID
- `name`: String (Unique)
- `category`: String (e.g., "Frontend", "Backend", "AI/ML")

#### `UserSkill` (Table: `user_skills`)
Many-to-many join table between User and Skill, with an extra attribute.
- `id`: UUID
- `userId`: UUID (Foreign Key)
- `skillId`: UUID (Foreign Key)
- `proficiencyLevel`: Enum

#### `Interest` (Table: `interests`)
Global dictionary of available interests (e.g., "AI/ML", "Web Development").
- `id`: UUID
- `name`: String (Unique)

#### `UserInterest` (Table: `user_interests`)
Many-to-many join table between User and Interest.
- `userId`: UUID (Foreign Key)
- `interestId`: UUID (Foreign Key)
*(Composite Primary Key: userId, interestId)*

#### `UserGoal` (Table: `user_goals`)
User's selected goals.
- `userId`: UUID (Foreign Key)
- `goal`: Enum
*(Composite Primary Key: userId, goal)*

## Commands

**Run Migrations:**
```bash
npx prisma migrate dev --name init
```

**Seed Database:**
```bash
npx prisma db seed
```
*(The seed script uses `upsert` so it's safe to run multiple times)*

## Future Expansion (Phase 2+)
In upcoming phases, we will introduce:
- `Projects` / `Teams` tables
- `Matches` or `Connections` between users
- `Messages` for chatting
