import { DATA_SOURCE } from './serviceMode'
import { mockTaskAdapter } from './mock/taskAdapter'
import { restTaskAdapter } from './rest/taskAdapter'

const adapter = DATA_SOURCE === 'mock' ? mockTaskAdapter : restTaskAdapter

export const taskService = {
  async getAll(filters) { return adapter.getAll(filters) },
  async getById(id) { return adapter.getById(id) },
  async create(data) { return adapter.create(data) },
  async update(id, changes) { return adapter.update(id, changes) },
  async updateStatus(id, status) { return adapter.updateStatus(id, status) },
  async delete(id) { return adapter.delete(id) },
}
