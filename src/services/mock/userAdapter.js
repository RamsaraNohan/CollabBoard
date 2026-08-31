import { mockRepository } from '../mockRepository'

export const mockUserAdapter = {
  async getAll() { return (await mockRepository.read()).users },
  async getById(id) { return (await mockRepository.read()).users.find((user) => user.id === id) || null },
  async getTasks(id) { return (await mockRepository.read()).tasks.filter((task) => task.assigneeId === id) },
  async update(id, changes) {
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
