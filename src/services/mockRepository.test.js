import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../data/constants'
import { mockRepository } from './mockRepository'
import { projectService } from './projectService'
import { taskService } from './taskService'
import { authService } from './authService'

describe('mock repository services', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    await mockRepository.reset()
    window.localStorage.setItem(STORAGE_KEYS.persistentSession, JSON.stringify({ userId: 'u1', token: 'mock-session-token', isAuthenticated: true, rememberMe: true }))
  })

  it('keeps a new account isolated until an owner adds it to a project', async () => {
    const registration = await authService.register({ name: 'Isolated Member', email: 'isolated@example.com', studentId: '41000', password: 'password123', rememberMe: true })
    expect(await projectService.getAll()).toEqual([])
    expect(await taskService.getAll()).toEqual([])

    await authService.login({ email: 'member1@example.com', password: 'password', rememberMe: true })
    const p1 = await projectService.getById('p1')
    await projectService.update('p1', { memberIds: [...p1.memberIds, registration.user.id] })
    await authService.login({ email: 'isolated@example.com', password: 'password', rememberMe: true })
    expect((await projectService.getAll()).map((project) => project.id)).toEqual(['p1'])
    expect((await taskService.getAll()).every((task) => task.projectId === 'p1')).toBe(true)
  })

  it('recovers from corrupted persisted data', async () => {
    window.localStorage.setItem(STORAGE_KEYS.workspace, '{bad json')
    const workspace = await mockRepository.read()
    expect(workspace.projects).toHaveLength(3)
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.workspace)).version).toBe(1)
  })

  it('creates, updates, and deletes through REST-compatible services', async () => {
    const project = await projectService.create({ name: 'Test Project', memberIds: ['u1'] })
    expect((await projectService.update(project.id, { name: 'Updated Project' })).name).toBe('Updated Project')
    const task = await taskService.create({ projectId: project.id, title: 'Test task', description: 'Service test', status: 'todo', priority: 'medium', labels: [], dueDate: '2026-09-10', assigneeId: 'u1' })
    expect((await taskService.getAll({ projectId: project.id }))).toHaveLength(1)
    expect((await taskService.updateStatus(task.id, 'done')).status).toBe('done')
    expect((await projectService.archive(project.id)).archived).toBe(true)
    await projectService.delete(project.id)
    await expect(projectService.getById(project.id)).rejects.toMatchObject({ status: 404 })
    await expect(taskService.getById(task.id)).rejects.toMatchObject({ status: 404 })
  })
})
