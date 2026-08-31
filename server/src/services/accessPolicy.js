import { forbidden, notFound } from '../utils/ApiError.js'

export function canAccessProject(project, userId) {
  return Boolean(project && (project.ownerId === userId || project.memberIds.includes(userId)))
}

export function resolveAccessibleProject(repository, projectId, userId) {
  const project = repository.findProject(projectId)
  if (!canAccessProject(project, userId)) throw notFound('PROJECT_NOT_FOUND', 'Project not found.')
  return project
}

export function requireProjectOwner(project, userId) {
  if (project.ownerId !== userId) throw forbidden('Only the project owner may manage this project.')
  return project
}

export function resolveAccessibleTask(repository, taskId, userId) {
  const task = repository.findTask(taskId)
  if (!task) throw notFound('TASK_NOT_FOUND', 'Task not found.')
  const project = repository.findProject(task.projectId)
  if (!canAccessProject(project, userId)) throw notFound('TASK_NOT_FOUND', 'Task not found.')
  return { task, project }
}

export function accessibleActiveProjectIds(repository, userId) {
  return repository.listProjectsForUser(userId).map((project) => project.id)
}
