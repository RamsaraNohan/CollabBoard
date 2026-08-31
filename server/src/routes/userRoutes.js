import { Router } from 'express'

export function createUserRoutes(controller) {
  const router = Router()
  router.get('/', controller.list)
  router.get('/:id', controller.get)
  router.patch('/:id', controller.update)
  return router
}
