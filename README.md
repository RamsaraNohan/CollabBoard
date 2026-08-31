# CollabBoard

CollabBoard is Group 61's responsive Kanban-style project workspace. Assignment 02 connects the completed React frontend to a JWT-protected Express REST API backed by deterministic server-side in-memory data.

## Architecture

```text
React pages
  -> WorkspaceProvider
  -> stable frontend services
  -> REST adapters + apiClient
  -> Express REST API
  -> in-memory repositories
```

Frontend selectors continue to calculate project progress, workload, overdue totals, and dashboard metrics. API mode never silently falls back to browser mock data. Explicit mock mode remains available for frontend development and tests.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Two local ports: `5173` for Vite and `5000` for Express

## Clean setup

1. Install frontend tooling:

   ```bash
   npm install
   ```

2. Install the separate backend package:

   ```bash
   npm --prefix server install
   ```

3. Copy `server/.env.example` to `server/.env` and replace `JWT_SECRET` with a local secret of at least 16 characters. Do not commit `server/.env`.

4. Optional: copy `.env.example` to `.env.local` to override the default API URL.

5. Start both applications:

   ```bash
   npm run dev:all
   ```

6. Open `http://localhost:5173`.

The API health endpoint is `http://localhost:5000/api/health`.

## Development login

Seeded users authenticate with their placeholder email and the development password `password`.

```text
member1@example.com / password
member2@example.com / password
member3@example.com / password
member4@example.com / password
member5@example.com / password
```

Passwords are bcrypt hashes in backend memory. Hashes, JWT secrets, and authentication records are never imported by the Vite frontend.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev:all` | Run Express and Vite together |
| `npm run dev:client` | Run the API-backed React frontend |
| `npm run dev:server` | Run Express with Node watch mode |
| `npm run dev:mock` | Run the frontend explicitly against browser mock data |
| `npm run test:run` | Run frontend tests |
| `npm run test:server` | Run backend tests |
| `npm run test:all` | Run frontend and backend suites |
| `npm run build` | Build the production frontend |

## REST API

Public endpoints:

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
```

Bearer JWT required:

```text
GET    /api/auth/me
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

Task list filters: `projectId`, `assigneeId`, `status`, `priority`, and `label`.

Projects and tasks are scoped by project ownership/membership. Project lists exclude archives by default; pass `includeArchived=true` to include accessible archives. Inaccessible project/task entities return non-disclosing 404 responses. Task `projectId` is immutable after creation.

The complete frozen contract is in `docs/ASSIGNMENT02_API_CONTRACT.md`.

## Postman

Import `postman/CollabBoard_Assignment02.postman_collection.json`. From a clean server restart, the collection registers a temporary user, proves zero initial visibility, grants and revokes project membership, verifies non-disclosing 404 behavior, exercises the member-removal conflict, confirms immutable task projects, restores seeded assignments/membership, and preserves the registered directory.

Run it from a terminal while the API is running:

```bash
npx --yes newman run postman/CollabBoard_Assignment02.postman_collection.json
```

When exporting machine-readable evidence, sanitize the generated file before committing it:

```bash
node scripts/sanitize_newman_results.mjs docs/assignment02/screenshots/postman/newman-results.json
```

## Data and security boundaries

- Backend mutations persist only until the Express process restarts.
- `JWT_SECRET` is required and is not committed.
- CORS accepts only the configured Vite origin(s).
- Users may patch only their own profile.
- Projects are visible only to their owner and members.
- Only project owners may edit project metadata/membership, archive, or delete.
- The Team UI contains shared-project collaborators, while `/api/users` remains the registered-user directory.
- Task assignees must belong to the selected project.
- Task `projectId` cannot be changed after creation.
- Removing a project member with assigned tasks returns `409 Conflict`.
- Deleting a project cascades its in-memory tasks.
- MongoDB, realtime, offline synchronization, Docker, and later milestones are intentionally excluded.

## Evidence and report

- Frontend campaign QA: `docs/FRONTEND_CORE_QA.md`
- Assignment 02 API contract: `docs/ASSIGNMENT02_API_CONTRACT.md`
- Assignment 02 REST QA: `docs/ASSIGNMENT02_REST_QA.md`
- Screenshots: `docs/assignment02/screenshots/`
- Report: `Group61_Assignment02_CollabBoard_Report.docx` and `.pdf`

Repository: https://github.com/RamsaraNohan/CollabBoard

The final Assignment 02 tag is created only after human approval and genuine contribution commits from all five members.
