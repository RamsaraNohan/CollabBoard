const clone = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value))

export class WorkspaceRepository {
  constructor(store) { this.store = store }

  nextId(entity) {
    const prefix = { user: 'u', project: 'p', task: 't' }[entity]
    this.store.counters[entity] += 1
    return `${prefix}${this.store.counters[entity]}`
  }

  listUsers() { return clone(this.store.users) }
  findUser(id) { return clone(this.store.users.find((item) => item.id === id) || null) }
  findUserByEmail(email) { return clone(this.store.users.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null) }
  findUserByStudentId(studentId) { return clone(this.store.users.find((item) => item.studentId && item.studentId === studentId) || null) }
  createUser(user, passwordHash) { this.store.users.push(clone(user)); this.store.authRecords.set(user.id, { userId: user.id, passwordHash }); return clone(user) }
  updateUser(id, changes) { const index = this.store.users.findIndex((item) => item.id === id); if (index < 0) return null; this.store.users[index] = { ...this.store.users[index], ...clone(changes), id }; return clone(this.store.users[index]) }
  getAuthRecord(userId) { return this.store.authRecords.get(userId) || null }

  listProjects({ includeArchived = false } = {}) { return clone(this.store.projects.filter((item) => includeArchived || !item.archived)) }
  findProject(id) { return clone(this.store.projects.find((item) => item.id === id) || null) }
  createProject(project) { this.store.projects.push(clone(project)); return clone(project) }
  updateProject(id, changes) { const index = this.store.projects.findIndex((item) => item.id === id); if (index < 0) return null; this.store.projects[index] = { ...this.store.projects[index], ...clone(changes), id }; return clone(this.store.projects[index]) }
  deleteProject(id) { const before = this.store.projects.length; this.store.projects = this.store.projects.filter((item) => item.id !== id); this.store.tasks = this.store.tasks.filter((item) => item.projectId !== id); return before !== this.store.projects.length }

  listTasks(filters = {}) { return clone(this.store.tasks.filter((task) => {
    if (filters.projectId && task.projectId !== filters.projectId) return false
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.label && !task.labels.includes(filters.label)) return false
    return true
  })) }
  findTask(id) { return clone(this.store.tasks.find((item) => item.id === id) || null) }
  createTask(task) { this.store.tasks.push(clone(task)); return clone(task) }
  updateTask(id, changes) { const index = this.store.tasks.findIndex((item) => item.id === id); if (index < 0) return null; this.store.tasks[index] = { ...this.store.tasks[index], ...clone(changes), id }; return clone(this.store.tasks[index]) }
  deleteTask(id) { const before = this.store.tasks.length; this.store.tasks = this.store.tasks.filter((item) => item.id !== id); return before !== this.store.tasks.length }
}
