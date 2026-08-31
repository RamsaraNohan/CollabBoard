# CollabBoard Core Frontend QA Evidence

Date: 31 August 2026

Branch: `codex/frontend-core-api-ready`

Approved upstream baseline: `830b651b54e6d16b47a5d3e1240be7261cb20dfe`

## Automated gates

- `npm run test:run`: passed (targeted seed, repository, authentication, selectors, routing, and overlay tests).
- `npm run build`: passed with Vite production output.
- `git diff --check`: passed.

## Manual route and interaction QA

The following routes were opened directly and refreshed successfully:

- `/login`
- `/register`
- `/dashboard`
- `/projects`
- `/projects/p1/overview`
- `/projects/p2/board`
- `/projects/p3/members`
- `/my-tasks`
- `/team`
- `/members/u5`
- `/settings`
- an unknown route, which rendered the application not-found state

The following workflows were exercised in the local browser:

- seeded development login, logout, protected-route redirect, and re-entry;
- project creation and confirmed permanent deletion;
- task creation, details, edit, status movement, confirmed deletion, and contextual task URLs;
- current-user My Tasks selection and status filtering;
- member details, derived metrics, project contribution, assigned task links, and preselected Assign Task;
- canonical Settings updates reflected in the shared sidebar profile;
- modal and drawer Escape dismissal;
- project-specific board filtering and missing-entity fallbacks.

## Responsive checks

- 390 × 844: mobile header and closed-by-default slide-over navigation; card-based My Tasks layout; no sidebar overflow.
- 768 × 900: tablet shell, two-column dashboard statistics, and stacked dashboard panels.
- 1024 × 900: desktop shell and two-column team cards.
- 1440 × 900: three-column project grid and full desktop navigation.

## No-dead-control audit

Visible core controls either complete their labeled action, navigate to the correct entity context, provide a confirmed destructive path, or are disabled for the current state. The unsupported Invite Member and Forgot Password controls are absent. Deferred collaboration controls were not introduced.

## Campaign boundary

The frontend campaign stops here. No Express server, REST endpoint, API client, JWT handling, database, realtime layer, or post-REST collaboration subsystem was added.
