import { ApiError } from '../apiClient'
import { getStoredSession } from '../sessionStore'

export function currentMockUserId() {
  const userId = getStoredSession()?.userId
  if (!userId) throw new ApiError('Authentication is required.', { status: 401, code: 'UNAUTHORIZED' })
  return userId
}

export const canAccessProject = (project, userId) => Boolean(project && (project.ownerId === userId || project.memberIds.includes(userId)))

export function requireMockProject(workspace, projectId, userId, { owner = false } = {}) {
  const project = workspace.projects.find((item) => item.id === projectId)
  if (!canAccessProject(project, userId)) throw new ApiError('Project not found.', { status: 404, code: 'PROJECT_NOT_FOUND' })
  if (owner && project.ownerId !== userId) throw new ApiError('Only the project owner may manage this project.', { status: 403, code: 'FORBIDDEN' })
  return project
}

export function requireMockTask(workspace, taskId, userId) {
  const task = workspace.tasks.find((item) => item.id === taskId)
  if (!task) throw new ApiError('Task not found.', { status: 404, code: 'TASK_NOT_FOUND' })
  requireMockProject(workspace, task.projectId, userId)
  return task
}
