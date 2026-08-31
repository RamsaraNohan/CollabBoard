import { conflict, forbidden, notFound } from '../utils/ApiError.js'
import { allowFields, email, optionalString, requireNonEmpty, requiredString } from '../utils/validation.js'

const initialsFor = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export function createUserController(repository) {
  return {
    list: async (_request, response) => response.json(repository.listUsers()),
    get: async (request, response) => {
      const user = repository.findUser(request.params.id)
      if (!user) throw notFound('USER_NOT_FOUND', 'Member not found.')
      response.json(user)
    },
    update: async (request, response) => {
      if (request.user.id !== request.params.id) throw forbidden('You may update only your own profile.')
      const body = requireNonEmpty(allowFields(request.body, ['name', 'email', 'studentId', 'avatarUrl', 'role']))
      const changes = {}
      if (body.name !== undefined) { changes.name = requiredString(body.name, 'name', { max: 120 }); changes.initials = initialsFor(changes.name) }
      if (body.email !== undefined) {
        changes.email = email(body.email)
        const duplicate = repository.findUserByEmail(changes.email)
        if (duplicate && duplicate.id !== request.user.id) throw conflict('EMAIL_EXISTS', 'An account with this email already exists.', ['email'])
      }
      if (body.studentId !== undefined) {
        changes.studentId = optionalString(body.studentId, 'studentId', { max: 30, nullable: true }) || null
        const duplicate = changes.studentId ? repository.findUserByStudentId(changes.studentId) : null
        if (duplicate && duplicate.id !== request.user.id) throw conflict('STUDENT_ID_EXISTS', 'An account with this student ID already exists.', ['studentId'])
      }
      if (body.avatarUrl !== undefined) changes.avatarUrl = optionalString(body.avatarUrl, 'avatarUrl', { max: 500, nullable: true }) || null
      if (body.role !== undefined) changes.role = requiredString(body.role, 'role', { max: 120 })
      changes.updatedAt = new Date().toISOString()
      response.json(repository.updateUser(request.user.id, changes))
    },
  }
}
