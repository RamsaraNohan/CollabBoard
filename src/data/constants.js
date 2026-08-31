export const STORAGE_KEYS = {
  workspace: 'collabboard.workspace.v1',
  persistentSession: 'collabboard.session.v1',
  temporarySession: 'collabboard.session.temp.v1',
}

export { WORKSPACE_VERSION } from '../../shared/domain.js'
export const DEMO_PASSWORD = 'password'

export const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
]

export const PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export { TASK_LABELS as LABELS, PROJECT_ACCENTS } from '../../shared/domain.js'
