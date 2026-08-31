import { DATA_SOURCE } from './serviceMode'
import { mockUserAdapter } from './mock/userAdapter'
import { restUserAdapter } from './rest/userAdapter'

const adapter = DATA_SOURCE === 'mock' ? mockUserAdapter : restUserAdapter

export const userService = {
  async getAll() { return adapter.getAll() },
  async getById(id) { return adapter.getById(id) },
  async getTasks(id) { return adapter.getTasks(id) },
  async update(id, changes) { return adapter.update(id, changes) },
}
