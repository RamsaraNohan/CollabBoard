import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createServerContext } from './createServerContext.js'

const testConfig = { jwtSecret: 'assignment-02-test-secret', environment: 'test', clientOrigin: 'http://localhost:5173' }
let app

async function login(email = 'member1@example.com', password = 'password') {
  return request(app).post('/api/auth/login').send({ email, password })
}

beforeEach(async () => {
  process.env.NODE_ENV = 'test'
  app = (await createServerContext({ config: testConfig, storeOptions: { today: new Date('2026-08-31T00:00:00Z') } })).app
})

describe('health and authentication', () => {
  it('serves health and protects private routes', async () => {
    expect((await request(app).get('/api/health')).body).toEqual({ status: 'ok', service: 'collabboard-api' })
    expect((await request(app).get('/api/projects')).status).toBe(401)
  })

  it('logs in, restores identity, and rejects invalid credentials', async () => {
    const authenticated = await login()
    expect(authenticated.status).toBe(200)
    expect(authenticated.body.user.id).toBe('u1')
    expect(authenticated.body.token).toBeTypeOf('string')
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${authenticated.body.token}`)).body.id).toBe('u1')
    expect((await login('member1@example.com', 'wrong')).status).toBe(401)
  })

  it('registers a user and rejects duplicate identities', async () => {
    const registration = await request(app).post('/api/auth/register').send({ name: 'New Member', email: 'new@example.com', studentId: '40000', password: 'password123' })
    expect(registration.status).toBe(201)
    expect(registration.body.user.id).toBe('u6')
    expect((await request(app).post('/api/auth/register').send({ name: 'Duplicate', email: 'new@example.com', password: 'password123' })).status).toBe(409)
  })

  it('returns consistent envelopes for invalid tokens and missing routes', async () => {
    const invalid = await request(app).get('/api/users').set('Authorization', 'Bearer invalid-token')
    expect(invalid.status).toBe(401)
    expect(invalid.body).toEqual({ error: { code: 'UNAUTHORIZED', message: 'The access token is invalid.', details: [] } })
    const missing = await request(app).get('/api/missing')
    expect(missing.status).toBe(404)
    expect(missing.body.error.code).toBe('ROUTE_NOT_FOUND')
  })
})

describe('project, task, and user API', () => {
  it('performs project CRUD and cascades project tasks', async () => {
    const token = (await login()).body.token
    const auth = { Authorization: `Bearer ${token}` }
    const created = await request(app).post('/api/projects').set(auth).send({ name: 'API Test', ownerId: 'u1', memberIds: ['u1', 'u2'], status: 'active', priority: 'high', accent: 'blue' })
    expect(created.status).toBe(201)
    const task = await request(app).post('/api/tasks').set(auth).send({ projectId: created.body.id, title: 'Verify API', description: 'Exercise the task endpoint.', assigneeId: 'u2', status: 'todo', priority: 'high', labels: ['TESTING'], dueDate: '2026-09-10' })
    expect(task.status).toBe(201)
    expect((await request(app).patch(`/api/projects/${created.body.id}`).set(auth).send({ memberIds: ['u1'] })).status).toBe(409)
    expect((await request(app).delete(`/api/projects/${created.body.id}`).set(auth)).status).toBe(204)
    expect((await request(app).get(`/api/tasks/${task.body.id}`).set(auth)).status).toBe(404)
  })

  it('filters, moves, edits, and deletes tasks with project isolation', async () => {
    const token = (await login()).body.token
    const auth = { Authorization: `Bearer ${token}` }
    const p2Tasks = await request(app).get('/api/tasks?projectId=p2&status=doing').set(auth)
    expect(p2Tasks.status).toBe(200)
    expect(p2Tasks.body.every((task) => task.projectId === 'p2' && task.status === 'doing')).toBe(true)
    const labelTasks = await request(app).get('/api/tasks?label=BACKEND&priority=high').set(auth)
    expect(labelTasks.body.every((task) => task.labels.includes('BACKEND') && task.priority === 'high')).toBe(true)
    const moved = await request(app).patch('/api/tasks/t12/status').set(auth).send({ status: 'done' })
    expect(moved.body.status).toBe('done')
    expect((await request(app).patch('/api/tasks/t12').set(auth).send({ assigneeId: 'u5' })).status).toBe(400)
    expect((await request(app).delete('/api/tasks/t12').set(auth)).status).toBe(204)
  })

  it('lists users, updates self, and forbids cross-user updates', async () => {
    const token = (await login()).body.token
    const auth = { Authorization: `Bearer ${token}` }
    expect((await request(app).get('/api/users').set(auth)).body).toHaveLength(5)
    expect((await request(app).patch('/api/users/u1').set(auth).send({ role: 'API Coordinator' })).body.role).toBe('API Coordinator')
    const forbidden = await request(app).patch('/api/users/u2').set(auth).send({ role: 'Changed' })
    expect(forbidden.status).toBe(403)
    expect(forbidden.body.error.code).toBe('FORBIDDEN')
  })
})
