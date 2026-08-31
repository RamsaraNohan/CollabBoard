import { apiRequest } from '../apiClient'

const writable = ['name', 'description', 'accent', 'ownerId', 'memberIds', 'startDate', 'dueDate', 'status', 'priority', 'isFavorite', 'archived']
const pickWritable = (value) => Object.fromEntries(writable.filter((key) => Object.hasOwn(value, key)).map((key) => [key, value[key]]))

export const restProjectAdapter = {
  async getAll(filters = {}) { return apiRequest('/projects', { query: filters }) },
  async getById(id) { return apiRequest(`/projects/${id}`) },
  async create(data) { return apiRequest('/projects', { method: 'POST', body: pickWritable(data) }) },
  async update(id, changes) { return apiRequest(`/projects/${id}`, { method: 'PATCH', body: pickWritable(changes) }) },
  async toggleFavorite(id) {
    const project = await restProjectAdapter.getById(id)
    return restProjectAdapter.update(id, { isFavorite: !project.isFavorite })
  },
  async archive(id) { return restProjectAdapter.update(id, { archived: true }) },
  async delete(id) { return apiRequest(`/projects/${id}`, { method: 'DELETE' }) },
}
