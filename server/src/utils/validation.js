import { badRequest } from './ApiError.js'

export function allowFields(body, fields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw badRequest('INVALID_BODY', 'Request body must be a JSON object.')
  const unknown = Object.keys(body).filter((key) => !fields.includes(key))
  if (unknown.length) throw badRequest('UNKNOWN_FIELDS', 'Request contains unsupported fields.', unknown)
  return Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined))
}

export function requireNonEmpty(body, message = 'At least one field is required.') {
  if (!Object.keys(body).length) throw badRequest('EMPTY_UPDATE', message)
  return body
}

export function requiredString(value, field, { min = 1, max = 200 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw badRequest('INVALID_FIELD', `${field} must be between ${min} and ${max} characters.`, [field])
  }
  return value.trim()
}

export function optionalString(value, field, { max = 1000, nullable = false } = {}) {
  if (value === undefined) return undefined
  if (nullable && value === null) return null
  if (typeof value !== 'string' || value.trim().length > max) throw badRequest('INVALID_FIELD', `${field} must be a string no longer than ${max} characters.`, [field])
  return value.trim()
}

export function email(value) {
  const normalized = requiredString(value, 'email', { max: 254 }).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw badRequest('INVALID_EMAIL', 'Enter a valid email address.', ['email'])
  return normalized
}

export function enumValue(value, field, values) {
  if (!values.includes(value)) throw badRequest('INVALID_FIELD', `${field} must be one of: ${values.join(', ')}.`, [field])
  return value
}

export function dateValue(value, field, { required = false } = {}) {
  if ((value === undefined || value === '') && !required) return value || null
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw badRequest('INVALID_DATE', `${field} must use YYYY-MM-DD format.`, [field])
  }
  return value
}

export function stringArray(value, field, { required = false, unique = true } = {}) {
  if (value === undefined && !required) return undefined
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) throw badRequest('INVALID_FIELD', `${field} must be an array of strings.`, [field])
  const normalized = value.map((item) => item.trim())
  return unique ? [...new Set(normalized)] : normalized
}

export function booleanValue(value, field) {
  if (typeof value !== 'boolean') throw badRequest('INVALID_FIELD', `${field} must be true or false.`, [field])
  return value
}
