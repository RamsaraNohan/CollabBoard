import { apiRequest } from '../apiClient'

const createWritable = ['projectId', 'title', 'description', 'assigneeId', 'status', 'priority', 'labels', 'dueDate']
const updateWritable = ['title', 'description', 'assigneeId', 'status', 'priority', 'labels', 'dueDate']
const pickWritable = (value, fields) => Object.fromEntries(fields.filter((key) => Object.hasOwn(value, key)).map((key) => [key, value[key]]))
const normalize = (value, fields) => {
  const body = pickWritable(value, fields)
  if (Object.hasOwn(body, 'assigneeId')) body.assigneeId = body.assigneeId || null
  return body
}

export const restTaskAdapter = {
  async getAll(filters = {}) { return apiRequest('/tasks', { query: filters }) },
  async getById(id) { return apiRequest(`/tasks/${id}`) },
  async create(data) { return apiRequest('/tasks', { method: 'POST', body: normalize(data, createWritable) }) },
  async update(id, changes) { return apiRequest(`/tasks/${id}`, { method: 'PATCH', body: normalize(changes, updateWritable) }) },
  async updateStatus(id, status) { return apiRequest(`/tasks/${id}/status`, { method: 'PATCH', body: { status } }) },
  async delete(id) { return apiRequest(`/tasks/${id}`, { method: 'DELETE' }) },
}
