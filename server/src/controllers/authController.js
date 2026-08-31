import { allowFields } from '../utils/validation.js'

export function createAuthController(authService) {
  return {
    register: async (request, response) => {
      const body = allowFields(request.body, ['name', 'email', 'studentId', 'password'])
      response.status(201).json(await authService.register(body))
    },
    login: async (request, response) => {
      const body = allowFields(request.body, ['email', 'password'])
      response.json(await authService.login(body))
    },
    me: async (request, response) => response.json(request.user),
  }
}
