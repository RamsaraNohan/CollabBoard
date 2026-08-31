import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { createMemoryStore } from './data/createMemoryStore.js'
import { WorkspaceRepository } from './repositories/workspaceRepository.js'
import { createAuthService } from './services/authService.js'

export async function createServerContext({ config: configOverrides = {}, storeOptions = {} } = {}) {
  const config = loadConfig(configOverrides)
  const store = await createMemoryStore(storeOptions)
  const repository = new WorkspaceRepository(store)
  const authService = createAuthService(repository, config)
  const app = createApp({ repository, authService, config })
  return { app, config, store, repository, authService }
}
