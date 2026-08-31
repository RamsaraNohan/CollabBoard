import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { conflict, unauthorized } from '../utils/ApiError.js'
import { email, optionalString, requiredString } from '../utils/validation.js'

const initialsFor = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export function createAuthService(repository, config) {
  const sign = (user) => jwt.sign({}, config.jwtSecret, { subject: user.id, expiresIn: config.jwtExpiresIn })
  return {
    async register(data) {
      const name = requiredString(data.name, 'name', { max: 120 })
      const userEmail = email(data.email)
      const password = requiredString(data.password, 'password', { min: 8, max: 128 })
      const studentId = optionalString(data.studentId, 'studentId', { max: 30, nullable: true }) || null
      if (repository.findUserByEmail(userEmail)) throw conflict('EMAIL_EXISTS', 'An account with this email already exists.', ['email'])
      if (studentId && repository.findUserByStudentId(studentId)) throw conflict('STUDENT_ID_EXISTS', 'An account with this student ID already exists.', ['studentId'])
      const now = new Date().toISOString()
      const user = { id: repository.nextId('user'), studentId, name, initials: initialsFor(name), email: userEmail, avatarUrl: null, role: 'Workspace Member', createdAt: now, updatedAt: now }
      const passwordHash = await bcrypt.hash(password, 10)
      repository.createUser(user, passwordHash)
      return { token: sign(user), user }
    },
    async login(data) {
      const userEmail = email(data.email)
      const password = requiredString(data.password, 'password', { min: 1, max: 128 })
      const user = repository.findUserByEmail(userEmail)
      const record = user ? repository.getAuthRecord(user.id) : null
      if (!user || !record || !(await bcrypt.compare(password, record.passwordHash))) throw unauthorized('Email or password is incorrect.')
      return { token: sign(user), user }
    },
    verify(token) {
      try {
        const payload = jwt.verify(token, config.jwtSecret)
        const user = repository.findUser(payload.sub)
        if (!user) throw unauthorized('The authenticated user no longer exists.')
        return user
      } catch (error) {
        if (error.status === 401) throw error
        throw unauthorized(error.name === 'TokenExpiredError' ? 'Your session has expired.' : 'The access token is invalid.')
      }
    },
  }
}
