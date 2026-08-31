import { PROJECT_ACCENTS, PROJECT_STATUSES, TASK_PRIORITIES } from '../../../shared/domain.js'
import { badRequest, conflict, notFound } from '../utils/ApiError.js'
import { allowFields, booleanValue, dateValue, enumValue, optionalString, requireNonEmpty, requiredString, stringArray } from '../utils/validation.js'

const writable = ['name', 'description', 'accent', 'ownerId', 'memberIds', 'startDate', 'dueDate', 'status', 'priority', 'isFavorite', 'archived']

function validateRelationships(repository, project) {
  if (!repository.findUser(project.ownerId)) throw badRequest('INVALID_OWNER', 'Project owner does not exist.', ['ownerId'])
  const missing = project.memberIds.filter((id) => !repository.findUser(id))
  if (missing.length) throw badRequest('INVALID_MEMBERS', 'One or more project members do not exist.', missing)
  if (!project.memberIds.includes(project.ownerId)) throw badRequest('OWNER_NOT_MEMBER', 'Project owner must be included in memberIds.', ['ownerId', 'memberIds'])
  if (project.startDate && project.dueDate && project.dueDate < project.startDate) throw badRequest('INVALID_DATE_RANGE', 'Project due date must not be before its start date.', ['dueDate'])
}

function cleanProject(body, { partial = false, currentUserId } = {}) {
  const input = partial ? requireNonEmpty(allowFields(body, writable)) : allowFields(body, writable)
  const result = {}
  if (!partial || input.name !== undefined) result.name = requiredString(input.name, 'name', { max: 160 })
  if (input.description !== undefined) result.description = optionalString(input.description, 'description', { max: 1200 })
  if (input.accent !== undefined) result.accent = enumValue(input.accent, 'accent', PROJECT_ACCENTS)
  if (!partial || input.ownerId !== undefined) result.ownerId = requiredString(input.ownerId ?? currentUserId, 'ownerId', { max: 80 })
  if (!partial || input.memberIds !== undefined) result.memberIds = stringArray(input.memberIds ?? [result.ownerId], 'memberIds', { required: true })
  if (input.startDate !== undefined) result.startDate = dateValue(input.startDate, 'startDate')
  if (input.dueDate !== undefined) result.dueDate = dateValue(input.dueDate, 'dueDate')
  if (input.status !== undefined) result.status = enumValue(input.status, 'status', PROJECT_STATUSES)
  if (input.priority !== undefined) result.priority = enumValue(input.priority, 'priority', TASK_PRIORITIES)
  if (input.isFavorite !== undefined) result.isFavorite = booleanValue(input.isFavorite, 'isFavorite')
  if (input.archived !== undefined) result.archived = booleanValue(input.archived, 'archived')
  return result
}

export function createProjectController(repository) {
  return {
    list: async (request, response) => response.json(repository.listProjects({ includeArchived: request.query.includeArchived === 'true' })),
    get: async (request, response) => {
      const project = repository.findProject(request.params.id)
      if (!project) throw notFound('PROJECT_NOT_FOUND', 'Project not found.')
      response.json(project)
    },
    create: async (request, response) => {
      const input = cleanProject(request.body, { currentUserId: request.user.id })
      const now = new Date().toISOString()
      const project = {
        id: repository.nextId('project'), description: '', accent: 'blue', startDate: null, dueDate: null,
        status: 'active', priority: 'medium', isFavorite: false, archived: false, ...input, createdAt: now, updatedAt: now,
      }
      validateRelationships(repository, project)
      response.status(201).json(repository.createProject(project))
    },
    update: async (request, response) => {
      const current = repository.findProject(request.params.id)
      if (!current) throw notFound('PROJECT_NOT_FOUND', 'Project not found.')
      const changes = cleanProject(request.body, { partial: true })
      const next = { ...current, ...changes }
      validateRelationships(repository, next)
      if (changes.memberIds) {
        const blocked = repository.listTasks({ projectId: current.id }).filter((task) => task.assigneeId && !next.memberIds.includes(task.assigneeId))
        if (blocked.length) throw conflict('PROJECT_MEMBER_HAS_TASKS', 'Reassign or unassign tasks before removing this member.', blocked.map((task) => task.id))
      }
      response.json(repository.updateProject(current.id, { ...changes, updatedAt: new Date().toISOString() }))
    },
    delete: async (request, response) => {
      if (!repository.findProject(request.params.id)) throw notFound('PROJECT_NOT_FOUND', 'Project not found.')
      repository.deleteProject(request.params.id)
      response.status(204).end()
    },
  }
}
