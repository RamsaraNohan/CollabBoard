import { describe, expect, it } from 'vitest'
import { createSeedWorkspace } from '../data/seedData'
import { filterTasks, getMemberMetrics, getProgress, getProjectTasks, sortTasks } from './selectors'

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
})
