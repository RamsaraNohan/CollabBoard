import { DATA_SOURCE } from './serviceMode'
import { mockProjectAdapter } from './mock/projectAdapter'
import { restProjectAdapter } from './rest/projectAdapter'

const adapter = DATA_SOURCE === 'mock' ? mockProjectAdapter : restProjectAdapter

export const projectService = {
  async getAll(filters) { return adapter.getAll(filters) },
  async getById(id) { return adapter.getById(id) },
  async create(data) { return adapter.create(data) },
  async update(id, changes) { return adapter.update(id, changes) },
  async toggleFavorite(id) { return adapter.toggleFavorite(id) },
  async archive(id) { return adapter.archive(id) },
  async delete(id) { return adapter.delete(id) },
}
