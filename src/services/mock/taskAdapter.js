import { mockRepository } from '../mockRepository'
import { ApiError } from '../apiClient'
import { canAccessProject, currentMockUserId, requireMockProject, requireMockTask } from './mockAccess'

function validateAssignee(workspace, project, assigneeId) {
  if (assigneeId && !project.memberIds.includes(assigneeId)) throw new ApiError('Task assignee must be a member of the selected project.', { status: 400, code: 'INVALID_ASSIGNEE', details: ['assigneeId'] })
}

export const mockTaskAdapter = {
  async getAll(filters = {}) {
    const workspace = await mockRepository.read()
    const userId = currentMockUserId()
    const accessibleIds = new Set(workspace.projects.filter((project) => !project.archived && canAccessProject(project, userId)).map((project) => project.id))
    return workspace.tasks.filter((task) => {
      if (!accessibleIds.has(task.projectId)) return false
      if (filters.projectId && task.projectId !== filters.projectId) return false
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.label && !task.labels.includes(filters.label)) return false
      return true
    })
  },
  async getById(id) {
    const workspace = await mockRepository.read()
    return requireMockTask(workspace, id, currentMockUserId())
  },
  async create(data) {
    const now = new Date().toISOString()
    const creatorId = currentMockUserId()
    let task
    await mockRepository.write((current) => {
      const project = requireMockProject(current, data.projectId, creatorId)
      validateAssignee(current, project, data.assigneeId)
      task = { ...data, id: `t${Date.now()}`, creatorId, assigneeId: data.assigneeId || null, createdAt: now, updatedAt: now }
      return { ...current, tasks: [...current.tasks, task] }
    })
    return task
  },
  async update(id, changes) {
    const { projectId: _ignoredProjectId, ...mutableChanges } = changes
    const updatedAt = new Date().toISOString()
    let updated
    await mockRepository.write((current) => {
      const task = requireMockTask(current, id, currentMockUserId())
      validateAssignee(current, requireMockProject(current, task.projectId, currentMockUserId()), mutableChanges.assigneeId)
      return { ...current, tasks: current.tasks.map((task) => {
      if (task.id !== id) return task
      updated = { ...task, ...mutableChanges, ...(Object.hasOwn(mutableChanges, 'assigneeId') ? { assigneeId: mutableChanges.assigneeId || null } : {}), id, updatedAt }
      return updated
      }) }
    })
    if (!updated) throw new Error('Task not found.')
    return updated
  },
  async updateStatus(id, status) {
    return mockTaskAdapter.update(id, { status })
  },
  async delete(id) {
    await mockRepository.write((current) => {
      requireMockTask(current, id, currentMockUserId())
      return { ...current, tasks: current.tasks.filter((task) => task.id !== id) }
    })
  },
}
