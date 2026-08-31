import { mockRepository } from '../mockRepository'
import { ApiError } from '../apiClient'
import { canAccessProject, currentMockUserId } from './mockAccess'

export const mockUserAdapter = {
  async getAll() { return (await mockRepository.read()).users },
  async getById(id) { return (await mockRepository.read()).users.find((user) => user.id === id) || null },
  async getTasks(id) {
    const workspace = await mockRepository.read()
    const userId = currentMockUserId()
    const accessible = new Set(workspace.projects.filter((project) => !project.archived && canAccessProject(project, userId)).map((project) => project.id))
    return workspace.tasks.filter((task) => task.assigneeId === id && accessible.has(task.projectId))
  },
  async update(id, changes) {
    if (id !== currentMockUserId()) throw new ApiError('You may update only your own profile.', { status: 403, code: 'FORBIDDEN' })
    const updatedAt = new Date().toISOString()
    let updated
    await mockRepository.write((current) => ({ ...current, users: current.users.map((user) => {
      if (user.id !== id) return user
      updated = { ...user, ...changes, id, updatedAt }
      return updated
    }) }))
    if (!updated) throw new Error('Member not found.')
    return updated
  },
}
