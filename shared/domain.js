export const WORKSPACE_VERSION = 1

export const TASK_STATUSES = ['todo', 'doing', 'done']
export const TASK_PRIORITIES = ['high', 'medium', 'low']
export const PROJECT_STATUSES = ['planning', 'active', 'completed']
export const PROJECT_ACCENTS = ['blue', 'purple', 'teal', 'orange', 'slate']
export const TASK_LABELS = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'DESIGN',
  'TESTING',
  'DEVOPS',
  'DOCUMENTATION',
]

export const PUBLIC_USER_FIELDS = [
  'id', 'studentId', 'name', 'initials', 'email', 'avatarUrl', 'role', 'createdAt', 'updatedAt',
]

export const PROJECT_FIELDS = [
  'id', 'name', 'description', 'accent', 'ownerId', 'memberIds', 'startDate', 'dueDate',
  'status', 'priority', 'isFavorite', 'archived', 'createdAt', 'updatedAt',
]

export const TASK_FIELDS = [
  'id', 'projectId', 'title', 'description', 'creatorId', 'assigneeId', 'status', 'priority',
  'labels', 'dueDate', 'createdAt', 'updatedAt',
]
