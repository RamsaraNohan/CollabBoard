# CollabBoard Assignment 02 API Contract

Frozen on 31 August 2026 from frontend commit `4ac9e84`.

## Boundary

CollabBoard keeps its React pages and selectors while replacing the mock persistence adapter with an explicit REST adapter. API mode never falls back to local mock data. Shared modules contain public entity data and enums only.

## Authentication

- Public: `GET /api/health`, `POST /api/auth/register`, `POST /api/auth/login`.
- Bearer JWT required: every other `/api` route.
- Login and registration return `{ token, user }`.
- Seed accounts use password `password` in development.
- Users may update only their own public profile.

## Resources

| Method | Path | Result |
|---|---|---|
| GET | `/api/auth/me` | Current public user |
| GET | `/api/users` | Public user array |
| GET | `/api/users/:id` | Public user |
| PATCH | `/api/users/:id` | Updated public user |
| GET | `/api/projects` | Project array |
| GET | `/api/projects/:id` | Project |
| POST | `/api/projects` | Created project |
| PATCH | `/api/projects/:id` | Updated project |
| DELETE | `/api/projects/:id` | `204` |
| GET | `/api/tasks` | Task array, filterable by projectId, assigneeId, status, priority, label |
| GET | `/api/tasks/:id` | Task |
| POST | `/api/tasks` | Created task |
| PATCH | `/api/tasks/:id` | Updated task |
| PATCH | `/api/tasks/:id/status` | Updated task |
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

The API uses 400 for invalid input, 401 for authentication failures, 403 for forbidden profile updates, 404 for missing resources, and 409 for identity or relationship conflicts.
