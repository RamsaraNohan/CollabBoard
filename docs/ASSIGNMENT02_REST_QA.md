# CollabBoard Assignment 02 REST QA Evidence

Date: 31 August 2026

Branch: `codex/assignment02-rest-api`

Frontend base: `4ac9e849c85dff5cca5a1c349771cf16b549b1a0`

## Automated gates

- Frontend: `npm run test:run` passed - 9 files, 20 tests.
- Backend: `npm run test:server` passed - 1 file, 14 scenarios.
- Postman/Newman: 28 requests, 28 assertions, 0 failures.
- Newman machine evidence is preserved in `docs/assignment02/screenshots/postman/newman-results.json` with Bearer tokens redacted after execution.
- Production frontend: `npm run build` passed (104 modules transformed).
- Whitespace gate: `git diff --check` passed.

## Startup and offline hotfix evidence

- Root cause: the required local `server/.env` did not exist; scripts, working directory, dotenv loading, and validation were correct.
- An ignored local `server/.env` was created with port 5000, Vite origin, eight-hour expiry, and a generated secret. The secret was never printed, staged, or committed.
- `npm run dev:server`, `/api/health`, seeded login, `/api/auth/me`, and `npm run dev:all` passed.
- With the API stopped, the frontend displayed Workspace unavailable and Retry without an unhandled Promise rejection.
- Restarting the API and selecting Retry restored the preserved session.
- Rotating the local development secret produced a real 401 and correctly cleared the session to Login.

## Access policy verified

- A newly registered user receives zero projects and zero tasks while remaining visible in the registered-user directory.
- Project lists are owner/member-scoped and exclude archives by default; `includeArchived=true` includes accessible archives.
- Archived projects remain directly readable to owner/member.
- Inaccessible project/task reads and mutations return non-disclosing 404 errors.
- Project creation derives immutable ownership from the JWT.
- Only owners manage project metadata, membership, archive, and deletion; visible members receive 403.
- Task queries scope accessible project IDs before applying filters.
- Project members may perform task CRUD; outside-project assignees are rejected.
- Task `projectId` patches return `400 IMMUTABLE_FIELD`.
- Removing a member with assigned tasks returns `409 PROJECT_MEMBER_HAS_TASKS`; after reassignment/unassignment, removal succeeds and access is immediately revoked.

## Live frontend integration

- Seeded login loaded the correct accessible projects/tasks through the real API.
- A newly registered zero-membership account showed the exact empty states for Dashboard, Projects, My Tasks, and Team; the sidebar contained no seeded projects and New Task was disabled.
- Team excluded the current user and global-directory-only accounts.
- Team project filtering recalculated collaborators and metrics for the selected shared project.
- Member cards displayed collaborating-project labels and scoped workload/task counts.
- Assign Task opened a project chooser when a collaborator shared multiple projects and listed only shared projects.
- Owner-only project controls were absent for non-owners; task editing displayed its project read-only.

## Responsive evidence

- 390 x 844: mobile task layout, Team filter stacking, and slide-over navigation.
- 768 x 900: Dashboard tablet layout.
- 1024 x 900: Team two-column layout.
- 1440 x 900: Dashboard, Projects, Board, Team, and Settings desktop layouts.

Screenshots are preserved under `docs/assignment02/screenshots/frontend/`, `backend/`, and `postman/`.

## No-dead-control and boundary audit

- Core project, task, Team, Dashboard, My Tasks, authentication, and settings controls remain functional through stable service facades.
- No frontend page calls `fetch` directly.
- API mode has no automatic mock fallback and does not call `mockRepository`.
- Mock mode is explicit and mirrors project/task access semantics.
- Favorites were removed from active behavior; the legacy data field remains inert for compatibility.
- Shared modules contain public enums and public seed entities only.
- No MongoDB, Socket.io, Docker, deployment, offline synchronization, comments, notifications, or later-milestone features were introduced.

## Submission gates still requiring people

Git history currently contains identifiable contributions from M N R Mudannayaka, K I S S Kariyawasm, and C R Gammbheera. Genuine Assignment 02 contributions from all five members have not yet been verified. The final tag `assignment-02-working-rest-apis` therefore remains uncreated until:

1. M D J Prabashana and D M S P Bandara make genuine contributions under their own identities.
2. All five contribution commits are reviewed.
3. The final implementation commit receives human approval.

No commits or tag will be fabricated to satisfy this gate.
