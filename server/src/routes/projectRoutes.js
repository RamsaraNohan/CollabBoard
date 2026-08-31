import { Router } from 'express'

export function createProjectRoutes(controller) {
  const router = Router()
  router.get('/', controller.list)
  router.get('/:id', controller.get)
  router.post('/', controller.create)
  router.patch('/:id', controller.update)
  router.delete('/:id', controller.delete)
  return router
}
