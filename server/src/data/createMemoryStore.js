import bcrypt from 'bcryptjs'
import { createSeedWorkspace } from '../../../shared/seedWorkspace.js'

const clone = (value) => JSON.parse(JSON.stringify(value))

export async function createMemoryStore({ today = new Date(), developmentPassword = 'password' } = {}) {
  const workspace = createSeedWorkspace(today)
  const passwordHash = await bcrypt.hash(developmentPassword, 10)
  return {
    users: clone(workspace.users),
    projects: clone(workspace.projects),
    tasks: clone(workspace.tasks),
    authRecords: new Map(workspace.users.map((user) => [user.id, { userId: user.id, passwordHash }])),
    counters: { user: 5, project: 3, task: 22 },
  }
}
