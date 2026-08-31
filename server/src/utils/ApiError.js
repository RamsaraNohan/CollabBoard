export class ApiError extends Error {
  constructor(status, code, message, details = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const badRequest = (code, message, details = []) => new ApiError(400, code, message, details)
export const unauthorized = (message = 'Authentication is required.') => new ApiError(401, 'UNAUTHORIZED', message)
export const forbidden = (message = 'You are not allowed to perform this action.') => new ApiError(403, 'FORBIDDEN', message)
export const notFound = (code, message) => new ApiError(404, code, message)
export const conflict = (code, message, details = []) => new ApiError(409, code, message, details)
