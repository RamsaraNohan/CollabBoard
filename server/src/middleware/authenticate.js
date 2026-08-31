import { unauthorized } from '../utils/ApiError.js'

export function authenticate(authService) {
  return (request, _response, next) => {
    const header = request.get('authorization') || ''
    const match = header.match(/^Bearer\s+(.+)$/i)
    if (!match) return next(unauthorized())
    try {
      request.user = authService.verify(match[1])
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
