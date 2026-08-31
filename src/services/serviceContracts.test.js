import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from './authService'
import { projectService } from './projectService'
import { taskService } from './taskService'
import { userService } from './userService'
import { apiRequest, ApiError } from './apiClient'
import { restAuthAdapter } from './rest/authAdapter'

describe('asynchronous service contracts', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('keeps every public mock facade Promise-compatible', () => {
    expect(authService.getSession()).toBeInstanceOf(Promise)
    expect(projectService.getAll()).toBeInstanceOf(Promise)
    expect(taskService.getAll()).toBeInstanceOf(Promise)
    expect(userService.getAll()).toBeInstanceOf(Promise)
  })

  it('stores a REST JWT and sends it as a Bearer token', async () => {
    const user = { id: 'u1', email: 'member1@example.com' }
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'jwt-token', user }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'p1' }]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    await restAuthAdapter.login({ email: user.email, password: 'password', rememberMe: true })
    expect(JSON.parse(window.localStorage.getItem('collabboard.session.v1')).token).toBe('jwt-token')
    await apiRequest('/projects')
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer jwt-token')
  })

  it('clears the session and normalizes a 401 API error', async () => {
    window.localStorage.setItem('collabboard.session.v1', JSON.stringify({ userId: 'u1', token: 'expired', isAuthenticated: true, rememberMe: true }))
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Expired', details: [] } }), { status: 401, headers: { 'Content-Type': 'application/json' } }))
    await expect(apiRequest('/projects')).rejects.toMatchObject({ name: 'ApiError', status: 401, code: 'UNAUTHORIZED' })
    expect(window.localStorage.getItem('collabboard.session.v1')).toBeNull()
    expect(ApiError).toBeTypeOf('function')
  })
})
