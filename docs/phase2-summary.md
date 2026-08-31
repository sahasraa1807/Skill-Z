# Skillz — Phase 2: Project Discovery Summary Report

This document summarizes what was built during **Phase 2: Project Discovery**, the challenges encountered, and how they were solved.

---

## 📅 Part 1: What We Did

In Phase 2, we built the project discovery, creation, and application system:

1. **Database Schema & Models**:
   - Added 5 new Prisma models: `Project`, `ProjectRole`, `ProjectRoleSkill`, `TeamMember`, and `JoinRequest`.
   - Added 3 enums: `ProjectType` (Portfolio, Hackathon, Startup, Open Source, Learning), `ProjectStatus` (Recruiting, Active, Completed, Paused), and `RequestStatus` (Pending, Accepted, Rejected, Withdrawn).
   - Applied migration `add_projects_schema` and regenerated the Prisma client.

2. **Backend Project & Application APIs**:
   - **Project CRUD**: Endpoints to create, read, update, and delete projects.
   - **Search & Filtering**: Filter projects by search text (title/description), domain, project type, and status with pagination.
   - **Auto-assigned Owner**: When a user creates a project, they are automatically added as the first team member with the role "Owner".
   - **Join Requests & Review**:
     - Users can submit join requests with an optional message.
     - Owners can view pending applications and accept or reject them.
     - Accepting an application automatically adds the user to the project's `TeamMember` list.

3. **Frontend Pages & Components**:
   - **Explore Projects Page (`/projects`)**: Search bar, domain/type/status filters, responsive grid of project cards, and pagination.
   - **Create Project Page (`/projects/create`)**: Multi-field form with domain/type selectors and an interactive role & skill builder.
   - **Project Details Page (`/projects/:id`)**: Project overview, required skills for open roles, confirmed team members, apply modal for candidates, and application review panel for owners.
   - **Edit Project Page (`/projects/:id/edit`)**: Pre-filled form allowing project owners to update project info, status, and role requirements.
   - **Reusable Components**: `ProjectCard`, `RoleBuilder`, `JoinRequestModal`, and `OwnerApplicationPanel`.
   - **Navigation**: Added "Explore Projects" and "+ Post Project" buttons to the top navigation bar.

---

## ⚠️ Part 2: Issues Faced & How We Solved Them

### 1. `Input` Component Missing `name` Attribute
* **Issue**: The common `Input.jsx` component was only applying the `id` prop to the HTML `<input>` element. Forms using `e.target.name` in their `handleChange` handlers received `undefined`, preventing form fields from updating state.
* **Solution**: Updated `Input.jsx` to pass `name={name || id}` and spread remaining props (`...props`) to the `<input>` element.

### 2. ID Field Reference Mismatch (`_id` vs `id`)
* **Issue**: Certain checks in `ProjectDetailsPage.jsx` were checking for MongoDB-style `_id` instead of PostgreSQL/Prisma standard `id` when checking project ownership and member status.
* **Solution**: Updated ownership and team member matching logic to compare `user.id === project.ownerId` and `m.user?.id || m.userId`.

### 3. Subagent Crash During Frontend Generation
* **Issue**: The frontend builder subagent lost network connection before creating `EditProjectPage.jsx` and wiring the routes.
* **Solution**: Handled the remaining components directly, created `EditProjectPage.jsx`, wired routes in `App.jsx`, updated `Navbar.jsx`, and verified the whole frontend build using `npm run build`.

---

## 🏆 Current Phase 2 Status
**Phase 2 is 100% complete and verified.**
- All frontend pages build cleanly without errors.
- Database tables, migrations, and Prisma models are active.
- Project creation, discovery/search, details view, applications, and accept/reject flows are fully functional.
