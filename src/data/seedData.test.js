import { describe, expect, it } from 'vitest'
import { createSeedWorkspace } from './seedData'

describe('seed workspace', () => {
  it('keeps normalized relationships valid across all projects and tasks', () => {
    const workspace = createSeedWorkspace(new Date('2026-08-31T00:00:00'))
    expect(workspace.users.map((user) => user.id)).toEqual(['u1', 'u2', 'u3', 'u4', 'u5'])
    expect(workspace.projects.map((project) => project.id)).toEqual(['p1', 'p2', 'p3'])
    expect(workspace.tasks.slice(0, 10).map((task) => task.id)).toEqual(Array.from({ length: 10 }, (_, index) => `t${index + 1}`))
    const userIds = new Set(workspace.users.map((user) => user.id))
    const projectIds = new Set(workspace.projects.map((project) => project.id))
    workspace.tasks.forEach((task) => {
      expect(projectIds.has(task.projectId)).toBe(true)
      expect(userIds.has(task.assigneeId)).toBe(true)
    })
  })
})
