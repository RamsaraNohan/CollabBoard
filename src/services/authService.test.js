import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_PASSWORD } from '../data/constants'
import { authService } from './authService'
import { mockRepository } from './mockRepository'

describe('auth service', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    await mockRepository.reset()
  })

  it('authenticates a seeded user and restores the temporary session', async () => {
    await authService.login({ email: 'member1@example.com', password: DEMO_PASSWORD, rememberMe: false })
    expect(await authService.getSession()).toMatchObject({ userId: 'u1', isAuthenticated: true, rememberMe: false })
    await authService.logout()
    expect(await authService.getSession()).toBeNull()
  })

  it('registers a local user and persists a remembered session', async () => {
    const result = await authService.register({ name: 'New Member', email: 'new@example.com', studentId: '40000', rememberMe: true })
    expect(result.user.studentId).toBe('40000')
    expect((await mockRepository.read()).users.some((user) => user.id === result.user.id)).toBe(true)
    expect(await authService.getSession()).toMatchObject({ userId: result.user.id, rememberMe: true })
  })
})
