import { mockRepository } from './mockRepository'

const nextId = (prefix) => `${prefix}${Date.now()}`

export const projectService = {
  async getAll(filters = {}) {
    const workspace = await mockRepository.read()
    return workspace.projects.filter((project) => filters.includeArchived || !project.archived)
  },

  async getById(id) {
    const workspace = await mockRepository.read()
    return workspace.projects.find((project) => project.id === id) || null
  },

  async create(data) {
    const now = new Date().toISOString()
    const project = { ...data, id: nextId('p'), isFavorite: false, archived: false, createdAt: now, updatedAt: now }
    await mockRepository.write((current) => ({ ...current, projects: [...current.projects, project] }))
    return project
  },

  async update(id, changes) {
    const updatedAt = new Date().toISOString()
    let updated
    await mockRepository.write((current) => ({
      ...current,
      projects: current.projects.map((project) => {
        if (project.id !== id) return project
        updated = { ...project, ...changes, id, updatedAt }
        return updated
      }),
    }))
    if (!updated) throw new Error('Project not found.')
    return updated
  },

  async toggleFavorite(id) {
    const project = await this.getById(id)
    if (!project) throw new Error('Project not found.')
    return this.update(id, { isFavorite: !project.isFavorite })
  },

  async archive(id) {
    return this.update(id, { archived: true })
  },

  async delete(id) {
    await mockRepository.write((current) => ({
      ...current,
      projects: current.projects.filter((project) => project.id !== id),
      tasks: current.tasks.filter((task) => task.projectId !== id),
    }))
  },
}
