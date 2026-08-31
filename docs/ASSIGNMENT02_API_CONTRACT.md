# CollabBoard Assignment 02 API Contract

Frozen on 31 August 2026 from frontend commit `4ac9e84`; access-scoping correction implemented on `codex/assignment02-rest-api`.

## Boundary

CollabBoard keeps its React pages and selectors while replacing the mock persistence adapter with an explicit REST adapter. API mode never falls back to local mock data. Shared modules contain public entity data and enums only.

## Authentication and identity

- Public: `GET /api/health`, `POST /api/auth/register`, `POST /api/auth/login`.
- Bearer JWT required: every other `/api` route.
- Login and registration return `{ token, user }`.
- Seed accounts use password `password` in development.
- Users may update only their own public profile.
- Project `ownerId` and task `creatorId` are derived from the JWT and are never trusted from request bodies.

## Project access policy

A project is accessible only when the requester is its owner or appears in `memberIds`.

- `GET /api/projects` returns accessible, non-archived projects.
- `GET /api/projects?includeArchived=true` includes accessible archived projects.
- `GET /api/projects/:id` may return an archived project to an owner/member.
- Inaccessible project reads return non-disclosing `404 PROJECT_NOT_FOUND`.
- Project creation automatically makes the requester owner and member.
- Only the owner may edit metadata/membership, archive, or delete the project.
- A visible non-owner receives `403` for owner-only mutations.
- Removing a member with assigned project tasks returns `409 PROJECT_MEMBER_HAS_TASKS` until those tasks are reassigned or unassigned.

## Task access policy

Task lists are restricted to tasks in the requester's accessible, non-archived projects before filters are applied. An inaccessible `projectId` filter therefore returns `[]`.

- Owners and members may create, edit, move status, and delete tasks in their projects.
- Inaccessible task reads and mutations return non-disclosing `404 TASK_NOT_FOUND`.
- Assignees must be project members.
- `projectId` is immutable after creation. Supplying it to `PATCH /api/tasks/:id` returns `400 IMMUTABLE_FIELD` with `details: ["projectId"]`.

## Registered directory and Team

`GET /api/users` remains the authenticated public account directory used by the project member picker. The frontend Team page is different: it derives only collaborators from shared, non-archived projects and excludes the current user.

## Resources

| Method | Path | Result |
|---|---|---|
| GET | `/api/auth/me` | Current public user |
| GET | `/api/users` | Registered public user array |
| GET | `/api/users/:id` | Public user |
| PATCH | `/api/users/:id` | Updated own public user |
| GET | `/api/projects` | Accessible project array; optional `includeArchived=true` |
| GET | `/api/projects/:id` | Accessible project |
| POST | `/api/projects` | Created owned project |
| PATCH | `/api/projects/:id` | Owner-only updated project |
| DELETE | `/api/projects/:id` | Owner-only `204` and task cascade |
| GET | `/api/tasks` | Accessible task array, filterable by projectId, assigneeId, status, priority, label |
| GET | `/api/tasks/:id` | Accessible task |
| POST | `/api/tasks` | Created project task |
| PATCH | `/api/tasks/:id` | Updated task; immutable project |
| PATCH | `/api/tasks/:id/status` | Updated task status |
| DELETE | `/api/tasks/:id` | `204` |

## Errors

Non-successful responses use:

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found",
    "details": []
  }
}
```

The API uses 400 for invalid input/immutable fields, 401 for authentication failures, 403 for visible owner-only or cross-profile actions, 404 for missing or inaccessible entities, and 409 for identity or member-assignment conflicts.
