import { apiRequest } from '../apiClient'

const writable = ['name', 'email', 'studentId', 'avatarUrl', 'role']
const pickWritable = (value) => Object.fromEntries(writable.filter((key) => Object.hasOwn(value, key)).map((key) => [key, value[key]]))

export const restUserAdapter = {
  async getAll() { return apiRequest('/users') },
  async getById(id) { return apiRequest(`/users/${id}`) },
  async getTasks(id) { return apiRequest('/tasks', { query: { assigneeId: id } }) },
  async update(id, changes) { return apiRequest(`/users/${id}`, { method: 'PATCH', body: pickWritable(changes) }) },
}
