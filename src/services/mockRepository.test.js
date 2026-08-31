import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../data/constants'
import { mockRepository } from './mockRepository'
import { projectService } from './projectService'
import { taskService } from './taskService'

describe('mock repository services', () => {
  beforeEach(() => window.localStorage.clear())

  it('recovers from corrupted persisted data', async () => {
    window.localStorage.setItem(STORAGE_KEYS.workspace, '{bad json')
    const workspace = await mockRepository.read()
    expect(workspace.projects).toHaveLength(3)
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.workspace)).version).toBe(1)
  })

  it('creates, updates, and deletes through REST-compatible services', async () => {
    const project = await projectService.create({ name: 'Test Project', memberIds: ['u1'] })
    expect((await projectService.toggleFavorite(project.id)).isFavorite).toBe(true)
    expect((await projectService.update(project.id, { name: 'Updated Project' })).name).toBe('Updated Project')
    expect((await projectService.archive(project.id)).archived).toBe(true)
    const task = await taskService.create({ projectId: project.id, title: 'Test task', description: 'Service test', status: 'todo', priority: 'medium', labels: [], dueDate: '2026-09-10', assigneeId: 'u1' })
    expect((await taskService.getAll({ projectId: project.id }))).toHaveLength(1)
    expect((await taskService.updateStatus(task.id, 'done')).status).toBe('done')
    await projectService.delete(project.id)
    expect(await projectService.getById(project.id)).toBeNull()
    expect(await taskService.getById(task.id)).toBeNull()
  })
})
