# Skillz — Phase 1: Foundation Summary Report

This document outlines the complete scope of work completed during **Phase 1: Foundation**, the architectural details, the challenges faced, and how they were resolved.

---

## 📅 Part 1: What We Did
In Phase 1, we successfully established the core identity and onboarding layer of the Skillz platform:

1. **Workspace Architecture**:
   - Structured a clean two-sided monorepo with `frontend/` (React + Vite + Tailwind CSS) and `backend/` (Node.js + Express + Prisma ORM + PostgreSQL).
   - Set up custom routes, controllers, services, config utilities, and middleware directories.

2. **Database Setup**:
   - Initialized PostgreSQL and defined the core Phase 1 tables (`users`, `user_preferences`, `skills`, `user_skills`, `interests`, `user_interests`, `user_goals`) with robust relationship constraints and enums for experience levels and project goals.
   - Wrote a master `seed.js` script to populate the database with 59 skills and 20 interests.

3. **Secure Authentication Flow**:
   - Implemented registration, login, and `/auth/me` endpoints on the backend.
   - Wrapped password storage in secure `bcryptjs` hashing.
   - Handled session management using signed JSON Web Tokens (JWT) stored in the browser's `localStorage`, complete with an Axios request interceptor to automatically attach authorization headers.

4. **Multi-Step Onboarding Wizard**:
   - Developed a 6-step onboarding flow on the frontend:
     - **Step 1**: Basic Info (Name, Username, Bio, Location)
     - **Step 2**: Skill Picker (Selects skills and assigns Beginner/Intermediate/Advanced levels)
     - **Step 3**: Interest Picker (Multi-select interest tags)
     - **Step 4**: Project Goals (Hackathons, Portfolios, Startup, etc.)
     - **Step 5**: Availability (Hours per week, Weekday/Weekend, Morning/Evening preferences)
     - **Step 6**: Experience Level + Optional Profile Links (GitHub, LinkedIn, Portfolio)

5. **Profile View & Edit Features**:
   - Built a public profile page layout showing the user's details, skills, interests, and availability preferences.
   - Built an **Edit Profile** page to update basic details and adjust preferences.
   - Designed a **Profile Confidence System** calculating completeness score (0-100%) based on specific profile completion signals.

---

## ⚠️ Part 2: Issues Faced & How We Solved Them

During the development and integration steps, we encountered several key issues:

### 1. Username Verification Constraint at Sign-up
* **Issue**: The initial database schema set the `username` field as `@unique` and required. Since registration only requests `name`, `email`, and `password`, attempts to create a user failed on unique constraint validations.
* **Solution**: Updated `prisma/schema.prisma` to make `username` optional (`username String? @unique`) at user creation time. The username is now successfully set and verified in Step 1 of onboarding.

### 2. TypeError / "Invalid Credentials" During Login
* **Issue**: After successful registration, any login attempt failed in the frontend UI with a generic "Invalid Credentials. Please try again." message, despite the PostgreSQL database showing the correct user record.
* **Solution**: The backend wraps successful auth responses in a `{ success: true, data: { token, user } }` envelope. The frontend was attempting to read `data.token` instead of `response.data.token`. This caused a javascript `TypeError` inside the success handler, which redirected execution to the catch-block. I updated both `LoginPage.jsx` and `SignupPage.jsx` to correctly destructure `{ token, user }` from `response.data`.

### 3. Broken Skills / Interests Selection
* **Issue**: On the Step 2 (Skills) onboarding screen, clicking a skill tag button did nothing, and the skill did not select or pop up the proficiency selector.
* **Solution**: The frontend rendering is populated by a hardcoded constant list, but clicking on it triggers a match against the master list fetched from the database to obtain the unique ID:
  ```javascript
  const found = allSkills.find((s) => s.name === skillName);
  ```
  Since the database had not been seeded, `allSkills` was empty, returning `undefined`. I ran `npx prisma db seed` on the backend to insert the 59 master skills and 20 interests, fixing the selection logic.

### 4. Integration Typing Mismatch on Interests
* **Issue**: On Step 3 (Interests) onboarding page, the interest selector mapped selected values by looking for numeric IDs (`typeof id === 'number'`), but our database schema uses UUID strings for all records.
* **Solution**: Reconfigured the filtering in `OnboardingPage.jsx` to map interest names to their corresponding string UUIDs using a boolean check on database matches.

### 5. SSL / TLS Certificate Rejection in NPM & Prisma
* **Issue**: Downloads of packages and Prisma binaries (schema-engine.exe) failed on the workspace machine with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` or `unable to verify the first certificate` errors.
* **Solution**: Resolved this by installing npm packages using the `--strict-ssl false` flag, and running all database/prisma operations under the TLS-reject bypass:
  ```powershell
  $env:NODE_TLS_REJECT_UNAUTHORIZED="0"
  ```

---

## 🏆 Current Phase 1 Status
**Phase 1 is now 100% complete and verified.** 
- All frontend components build successfully.
- Database connection, schemas, migrations, and seeds are fully active.
- Core authentication, onboarding data submission, profile editing, and profile confidence metrics are verified.
