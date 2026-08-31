import cors from 'cors'
import express from 'express'
import { createAuthController } from './controllers/authController.js'
import { createProjectController } from './controllers/projectController.js'
import { createTaskController } from './controllers/taskController.js'
import { createUserController } from './controllers/userController.js'
import { authenticate } from './middleware/authenticate.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { createAuthRoutes } from './routes/authRoutes.js'
import { createProjectRoutes } from './routes/projectRoutes.js'
import { createTaskRoutes } from './routes/taskRoutes.js'
import { createUserRoutes } from './routes/userRoutes.js'

export function createApp({ repository, authService, config }) {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.clientOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Origin is not allowed by CollabBoard CORS policy.'))
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'collabboard-api' }))

  const authMiddleware = authenticate(authService)
  app.use('/api/auth', createAuthRoutes(createAuthController(authService), authMiddleware))
  app.use('/api/users', authMiddleware, createUserRoutes(createUserController(repository)))
  app.use('/api/projects', authMiddleware, createProjectRoutes(createProjectController(repository)))
  app.use('/api/tasks', authMiddleware, createTaskRoutes(createTaskController(repository)))

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
