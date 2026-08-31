import { mockRepository } from '../mockRepository'

export const mockTaskAdapter = {
  async getAll(filters = {}) {
    return (await mockRepository.read()).tasks.filter((task) => {
      if (filters.projectId && task.projectId !== filters.projectId) return false
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.label && !task.labels.includes(filters.label)) return false
      return true
    })
  },
  async getById(id) {
    return (await mockRepository.read()).tasks.find((task) => task.id === id) || null
  },
  async create(data) {
    const now = new Date().toISOString()
    const task = { ...data, id: `t${Date.now()}`, creatorId: data.creatorId || null, assigneeId: data.assigneeId || null, createdAt: now, updatedAt: now }
    await mockRepository.write((current) => ({ ...current, tasks: [...current.tasks, task] }))
    return task
  },
  async update(id, changes) {
    const updatedAt = new Date().toISOString()
    let updated
    await mockRepository.write((current) => ({ ...current, tasks: current.tasks.map((task) => {
      if (task.id !== id) return task
      updated = { ...task, ...changes, ...(Object.hasOwn(changes, 'assigneeId') ? { assigneeId: changes.assigneeId || null } : {}), id, updatedAt }
      return updated
    }) }))
    if (!updated) throw new Error('Task not found.')
    return updated
  },
  async updateStatus(id, status) {
    return mockTaskAdapter.update(id, { status })
  },
  async delete(id) {
    await mockRepository.write((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }))
  },
}
