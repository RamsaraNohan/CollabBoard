import { describe, expect, it } from 'vitest'
import { createSeedWorkspace } from '../data/seedData'
import { filterTasks, getCollaborators, getMemberMetrics, getProgress, getProjectTasks, getSharedProjects, getTasksForProjects, sortTasks } from './selectors'

const workspace = createSeedWorkspace(new Date('2026-08-31T00:00:00'))

describe('workspace selectors', () => {
  it('selects project-specific and current-user work', () => {
    expect(getProjectTasks(workspace.tasks, 'p1')).toHaveLength(10)
    expect(filterTasks(workspace.tasks, { assigneeId: 'u5' }, workspace.users).every((task) => task.assigneeId === 'u5')).toBe(true)
  })

  it('derives progress, workload, overdue, and sorting consistently', () => {
    expect(getProgress(getProjectTasks(workspace.tasks, 'p1'))).toBe(30)
    const metrics = getMemberMetrics(workspace.tasks, 'u1', new Date('2026-08-31T00:00:00'))
    expect(metrics.assigned).toBeGreaterThan(0)
    expect(metrics.open).toBe(metrics.todo + metrics.doing)
    expect(['Low', 'Medium', 'High']).toContain(metrics.workload)
    const ordered = sortTasks(workspace.tasks, 'priority')
    expect(ordered[0].priority).toBe('high')
  })

  it('derives collaborators and metrics only from shared active projects', () => {
    const projects = workspace.projects.map((project) => project.id === 'p1' ? { ...project, archived: true } : project)
    const collaborators = getCollaborators(workspace.users, projects, 'u5')
    expect(collaborators.map((user) => user.id).sort()).toEqual(['u1', 'u2', 'u4'])
    expect(getCollaborators(workspace.users, projects, 'u5', 'p2')).toEqual([])
    const shared = getSharedProjects(projects, 'u5', 'u2')
    expect(shared.map((project) => project.id)).toEqual(['p3'])
    expect(getTasksForProjects(workspace.tasks, shared).every((task) => task.projectId === 'p3')).toBe(true)
  })
})
