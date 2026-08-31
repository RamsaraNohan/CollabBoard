import { ApiError } from '../utils/ApiError.js'

export function notFoundHandler(request, _response, next) {
  next(new ApiError(404, 'ROUTE_NOT_FOUND', `No route matches ${request.method} ${request.originalUrl}.`))
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body contains invalid JSON.', details: [] } })
  }
  const status = error instanceof ApiError ? error.status : 500
  const code = error instanceof ApiError ? error.code : 'INTERNAL_ERROR'
  const message = error instanceof ApiError ? error.message : 'An unexpected server error occurred.'
  const details = error instanceof ApiError ? error.details : []
  if (status === 500 && process.env.NODE_ENV !== 'test') console.error(error)
  return response.status(status).json({ error: { code, message, details } })
}
