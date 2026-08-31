# CollabBoard Assignment 02 REST QA Evidence

Date: 31 August 2026

Branch: `codex/assignment02-rest-api`

Frontend base: `4ac9e849c85dff5cca5a1c349771cf16b549b1a0`

## Automated gates

- Frontend: `npm run test:run` passed - 7 files, 12 tests.
- Backend: `npm run test:server` passed - 1 file, 7 scenarios.
- Postman/Newman: 17 requests, 17 assertions, 0 failures.
- Production frontend: `npm run build` passed.
- Package audits: root and server installs reported 0 vulnerabilities.
- Whitespace gate: `git diff --check` passed after implementation.

## API behavior verified

- Health, registration, login, current identity, invalid credentials, invalid tokens, and protected routes.
- Public user roster, member lookup, self-profile update, and forbidden cross-user update.
- Project list/read/create/update/favorite/archive/delete and task cascade.
- Project owner/member validation and `409` member-removal conflict.
- Task create/read/update/status/delete and project/assignee/status/priority/label filtering.
- Strict project-member task assignment and `null` unassigned normalization.
- Consistent `400`, `401`, `403`, `404`, and `409` error envelopes.

## Live frontend integration

The browser campaign exercised the real Express server rather than mock mode:

- Login UI -> `POST /api/auth/login` -> JWT -> protected Dashboard.
- Invalid JWT after secret rotation -> session cleared -> Login redirect.
- Create Project -> API -> repository -> refreshed project list.
- Open Project -> project-specific tasks only.
- Create, open, edit, and move Task through the API.
- Five-member Team and Member Details loaded from `/api/users` plus filtered tasks.
- Settings updated and restored the current user's canonical profile.
- Project member removal with assigned tasks displayed the server's `409` message.
- Missing project and unknown route fallbacks rendered without breaking the shell.
- The handled `409` path added no new browser console errors after the form-boundary fix.

Project/task deletion was additionally verified by backend tests and the executable Postman cleanup requests. The browser QA did not retain destructive fixtures after the in-memory server restart.

## Responsive evidence

- 390 x 844: mobile My Tasks card layout; sidebar geometry moved from `left: -273px` when closed to `left: 0` when open and returned off-screen after dismissal.
- 768 x 900: Dashboard loaded with the tablet layout.
- 1024 x 900: Team rendered the expected two-column cards.
- 1440 x 900: Dashboard, Projects, Board, Team, and Settings rendered with desktop navigation.

Screenshots are preserved under `docs/assignment02/screenshots/frontend/`, `backend/`, and `postman/`.

## No-dead-control and boundary audit

- Core project, task, team, dashboard, My Tasks, authentication, and settings controls remain functional through the stable service facades.
- No frontend page calls `fetch` directly.
- API mode has no automatic mock fallback and does not call `mockRepository`.
- Mock mode remains explicit through `.env.mock` and `.env.test`.
- Shared modules contain public enums and public seed entities only.
- No MongoDB, Socket.io, Docker, deployment, offline synchronization, comments, notifications, or later-milestone features were introduced.

## Submission gates still requiring people

Git history currently contains identifiable contributions from M N R Mudannayaka, K I S S Kariyawasm, and C R Gammbheera. Genuine Assignment 02 contributions from all five members have not yet been verified. The final tag `assignment-02-working-rest-apis` must therefore remain uncreated until:

1. M D J Prabashana and D M S P Bandara make genuine contributions under their own identities.
2. All five contribution commits are reviewed.
3. The final implementation commit receives human approval.

No commits or tag will be fabricated to satisfy this gate.
