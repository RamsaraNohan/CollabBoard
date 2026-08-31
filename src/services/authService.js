import { DATA_SOURCE } from './serviceMode'
import { mockAuthAdapter } from './mock/authAdapter'
import { restAuthAdapter } from './rest/authAdapter'

const adapter = DATA_SOURCE === 'mock' ? mockAuthAdapter : restAuthAdapter

export const authService = {
  async getSession() { return adapter.getSession() },
  async login(data) { return adapter.login(data) },
  async register(data) { return adapter.register(data) },
  async logout() { return adapter.logout() },
}
