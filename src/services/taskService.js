import { mockRepository } from './mockRepository'

export const taskService = {
  async getAll(filters = {}) {
    const workspace = await mockRepository.read()
    return workspace.tasks.filter((task) => {
      if (filters.projectId && task.projectId !== filters.projectId) return false
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false
      return true
    })
  },

  async getById(id) {
    const workspace = await mockRepository.read()
    return workspace.tasks.find((task) => task.id === id) || null
  },

  async create(data) {
    const now = new Date().toISOString()
    const task = { ...data, id: `t${Date.now()}`, creatorId: data.creatorId || null, createdAt: now, updatedAt: now }
    await mockRepository.write((current) => ({ ...current, tasks: [...current.tasks, task] }))
    return task
  },

  async update(id, changes) {
    const updatedAt = new Date().toISOString()
    let updated
    await mockRepository.write((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) return task
        updated = { ...task, ...changes, id, updatedAt }
        return updated
      }),
    }))
    if (!updated) throw new Error('Task not found.')
    return updated
  },

  async updateStatus(id, status) {
    return this.update(id, { status })
  },

  async delete(id) {
    await mockRepository.write((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }))
  },
}
