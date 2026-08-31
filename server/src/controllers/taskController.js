import { TASK_LABELS, TASK_PRIORITIES, TASK_STATUSES } from '../../../shared/domain.js'
import { badRequest, notFound } from '../utils/ApiError.js'
import { allowFields, dateValue, enumValue, optionalString, requireNonEmpty, requiredString, stringArray } from '../utils/validation.js'
import { accessibleActiveProjectIds, resolveAccessibleProject, resolveAccessibleTask } from '../services/accessPolicy.js'

const createWritable = ['projectId', 'title', 'description', 'assigneeId', 'status', 'priority', 'labels', 'dueDate']
const updateWritable = ['title', 'description', 'assigneeId', 'status', 'priority', 'labels', 'dueDate']

function cleanTask(body, { partial = false } = {}) {
  if (partial && body && Object.prototype.hasOwnProperty.call(body, 'projectId')) {
    throw badRequest('IMMUTABLE_FIELD', 'Task project cannot be changed after creation.', ['projectId'])
  }
  const input = partial ? requireNonEmpty(allowFields(body, updateWritable)) : allowFields(body, createWritable)
  const result = {}
  if (!partial || input.projectId !== undefined) result.projectId = requiredString(input.projectId, 'projectId', { max: 80 })
  if (!partial || input.title !== undefined) result.title = requiredString(input.title, 'title', { max: 200 })
  if (!partial || input.description !== undefined) result.description = requiredString(input.description, 'description', { max: 2000 })
  if (input.assigneeId !== undefined) result.assigneeId = optionalString(input.assigneeId, 'assigneeId', { max: 80, nullable: true }) || null
  if (!partial || input.status !== undefined) result.status = enumValue(input.status, 'status', TASK_STATUSES)
  if (!partial || input.priority !== undefined) result.priority = enumValue(input.priority, 'priority', TASK_PRIORITIES)
  if (!partial || input.labels !== undefined) {
    result.labels = stringArray(input.labels, 'labels', { required: true })
    const invalid = result.labels.filter((label) => !TASK_LABELS.includes(label))
    if (invalid.length) throw badRequest('INVALID_LABELS', 'One or more task labels are invalid.', invalid)
  }
  if (!partial || input.dueDate !== undefined) result.dueDate = dateValue(input.dueDate, 'dueDate', { required: true })
  return result
}

function validateRelationships(repository, task) {
  const project = repository.findProject(task.projectId)
  if (!project) throw badRequest('INVALID_PROJECT', 'Task project does not exist.', ['projectId'])
  if (task.assigneeId && !project.memberIds.includes(task.assigneeId)) throw badRequest('INVALID_ASSIGNEE', 'Task assignee must be a member of the selected project.', ['assigneeId'])
  return project
}

export function createTaskController(repository) {
  return {
    list: async (request, response) => {
      const filters = Object.fromEntries(['projectId', 'assigneeId', 'status', 'priority', 'label'].filter((key) => request.query[key]).map((key) => [key, request.query[key]]))
      if (filters.status) enumValue(filters.status, 'status', TASK_STATUSES)
      if (filters.priority) enumValue(filters.priority, 'priority', TASK_PRIORITIES)
      if (filters.label && !TASK_LABELS.includes(filters.label)) throw badRequest('INVALID_LABEL', 'Task label filter is invalid.', ['label'])
      response.json(repository.listTasksForProjects(accessibleActiveProjectIds(repository, request.user.id), filters))
    },
    get: async (request, response) => {
      const { task } = resolveAccessibleTask(repository, request.params.id, request.user.id)
      response.json(task)
    },
    create: async (request, response) => {
      const input = cleanTask(request.body)
      resolveAccessibleProject(repository, input.projectId, request.user.id)
      const now = new Date().toISOString()
      const task = { ...input, id: repository.nextId('task'), creatorId: request.user.id, assigneeId: input.assigneeId || null, createdAt: now, updatedAt: now }
      validateRelationships(repository, task)
      response.status(201).json(repository.createTask(task))
    },
    update: async (request, response) => {
      const { task: current } = resolveAccessibleTask(repository, request.params.id, request.user.id)
      const changes = cleanTask(request.body, { partial: true })
      validateRelationships(repository, { ...current, ...changes })
      response.json(repository.updateTask(current.id, { ...changes, updatedAt: new Date().toISOString() }))
    },
    updateStatus: async (request, response) => {
      const { task: current } = resolveAccessibleTask(repository, request.params.id, request.user.id)
      const body = allowFields(request.body, ['status'])
      const status = enumValue(body.status, 'status', TASK_STATUSES)
      response.json(repository.updateTask(current.id, { status, updatedAt: new Date().toISOString() }))
    },
    delete: async (request, response) => {
      const { task } = resolveAccessibleTask(repository, request.params.id, request.user.id)
      repository.deleteTask(task.id)
      response.status(204).end()
    },
  }
}
