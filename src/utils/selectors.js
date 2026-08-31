import { isOverdue } from './dates'

export const getUserById = (users, id) => users.find((user) => user.id === id)
export const getProjectById = (projects, id) => projects.find((project) => project.id === id)
export const getTaskById = (tasks, id) => tasks.find((task) => task.id === id)
export const getProjectTasks = (tasks, projectId) => tasks.filter((task) => task.projectId === projectId)
export const getUserTasks = (tasks, userId) => tasks.filter((task) => task.assigneeId === userId)
export const getActiveProjects = (projects) => projects.filter((project) => !project.archived)

export function getSharedProjects(projects, currentUserId, memberId) {
  return getActiveProjects(projects).filter((project) => project.memberIds.includes(currentUserId) && project.memberIds.includes(memberId))
}

export function getCollaborators(users, projects, currentUserId, projectId = 'all') {
  const scopedProjects = getActiveProjects(projects).filter((project) => (
    project.memberIds.includes(currentUserId) && (projectId === 'all' || project.id === projectId)
  ))
  const collaboratorIds = new Set(scopedProjects.flatMap((project) => project.memberIds).filter((id) => id !== currentUserId))
  return users.filter((user) => collaboratorIds.has(user.id))
}

export function getTasksForProjects(tasks, projects) {
  const projectIds = new Set(projects.map((project) => project.id))
  return tasks.filter((task) => projectIds.has(task.projectId))
}

export function getTaskCounts(tasks, today = new Date()) {
  return {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    doing: tasks.filter((task) => task.status === 'doing').length,
    done: tasks.filter((task) => task.status === 'done').length,
    overdue: tasks.filter((task) => isOverdue(task, today)).length,
  }
}

export function getProgress(tasks) {
  if (!tasks.length) return 0
  return Math.round((tasks.filter((task) => task.status === 'done').length / tasks.length) * 100)
}

export function getMemberMetrics(tasks, userId, today = new Date()) {
  const assigned = getUserTasks(tasks, userId)
  const counts = getTaskCounts(assigned, today)
  const open = counts.todo + counts.doing
  return {
    ...counts,
    assigned: assigned.length,
    open,
    completion: getProgress(assigned),
    workload: open <= 2 ? 'Low' : open <= 4 ? 'Medium' : 'High',
  }
}

export function getProjectContributions(tasks, projects, userId) {
  return projects.map((project) => ({
    project,
    count: tasks.filter((task) => task.projectId === project.id && task.assigneeId === userId).length,
  })).filter((entry) => entry.count > 0)
}

export function filterTasks(tasks, filters = {}, users = []) {
  const query = filters.query?.trim().toLowerCase()
  return tasks.filter((task) => {
    const assignee = getUserById(users, task.assigneeId)
    const haystack = `${task.title} ${task.description} ${task.labels.join(' ')} ${assignee?.name || ''}`.toLowerCase()
    if (query && !haystack.includes(query)) return false
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) return false
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) return false
    if (filters.projectId && filters.projectId !== 'all' && task.projectId !== filters.projectId) return false
    if (filters.assigneeId && filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) return false
    if (filters.label && filters.label !== 'all' && !task.labels.includes(filters.label)) return false
    if (filters.overdue && !isOverdue(task)) return false
    return true
  })
}

const priorityRank = { high: 0, medium: 1, low: 2 }

export function sortTasks(tasks, sort = 'due') {
  return [...tasks].sort((a, b) => {
    if (sort === 'priority') return priorityRank[a.priority] - priorityRank[b.priority]
    if (sort === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt)
    if (sort === 'alpha') return a.title.localeCompare(b.title)
    return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31')
  })
}
