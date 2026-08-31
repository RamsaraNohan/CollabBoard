import { mockRepository } from '../mockRepository'
import { ApiError } from '../apiClient'
import { currentMockUserId, canAccessProject, requireMockProject } from './mockAccess'

const nextId = () => `p${Date.now()}`

export const mockProjectAdapter = {
  async getAll(filters = {}) {
    const workspace = await mockRepository.read()
    const userId = currentMockUserId()
    return workspace.projects.filter((project) => canAccessProject(project, userId) && (filters.includeArchived || !project.archived))
  },
  async getById(id) {
    return requireMockProject(await mockRepository.read(), id, currentMockUserId())
  },
  async create(data) {
    if (Object.hasOwn(data, 'ownerId')) throw new ApiError('Request contains unsupported fields.', { status: 400, code: 'UNKNOWN_FIELDS', details: ['ownerId'] })
    const now = new Date().toISOString()
    const ownerId = currentMockUserId()
    const project = { ...data, id: nextId(), ownerId, memberIds: [...new Set([ownerId, ...(data.memberIds || [])])], isFavorite: false, archived: false, createdAt: now, updatedAt: now }
    await mockRepository.write((current) => ({ ...current, projects: [...current.projects, project] }))
    return project
  },
  async update(id, changes) {
    const updatedAt = new Date().toISOString()
    let updated
    await mockRepository.write((current) => {
      const project = requireMockProject(current, id, currentMockUserId(), { owner: true })
      if (Object.hasOwn(changes, 'ownerId') || Object.hasOwn(changes, 'isFavorite')) throw new ApiError('Request contains unsupported fields.', { status: 400, code: 'UNKNOWN_FIELDS' })
      if (changes.memberIds && !changes.memberIds.includes(project.ownerId)) throw new ApiError('Project owner must remain a member.', { status: 400, code: 'OWNER_NOT_MEMBER' })
      const blocked = changes.memberIds ? current.tasks.filter((task) => task.projectId === id && task.assigneeId && !changes.memberIds.includes(task.assigneeId)) : []
      if (blocked.length) throw new ApiError('Reassign or unassign tasks before removing this member.', { status: 409, code: 'PROJECT_MEMBER_HAS_TASKS', details: blocked.map((task) => task.id) })
      return { ...current, projects: current.projects.map((project) => {
      if (project.id !== id) return project
      updated = { ...project, ...changes, id, updatedAt }
      return updated
      }) }
    })
    if (!updated) throw new Error('Project not found.')
    return updated
  },
  async archive(id) {
    return mockProjectAdapter.update(id, { archived: true })
  },
  async delete(id) {
    await mockRepository.write((current) => {
      requireMockProject(current, id, currentMockUserId(), { owner: true })
      return { ...current, projects: current.projects.filter((project) => project.id !== id), tasks: current.tasks.filter((task) => task.projectId !== id) }
    })
  },
}
