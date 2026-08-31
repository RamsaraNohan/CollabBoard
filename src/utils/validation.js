export function validateLogin({ email, password }) {
  const errors = {}
  if (!email?.trim()) errors.email = 'Email is required.'
  if (!password?.trim()) errors.password = 'Password is required.'
  return errors
}

export function validateRegistration({ name, email, password, confirm }) {
  const errors = validateLogin({ email, password })
  if (!name?.trim()) errors.name = 'Full name is required.'
  if ((password || '').length < 8) errors.password = 'Use at least 8 characters.'
  if (password !== confirm) errors.confirm = 'Passwords do not match.'
  return errors
}

export function validateProject(project) {
  const errors = {}
  if (!project.name?.trim()) errors.name = 'Project name is required.'
  if (project.startDate && project.dueDate && project.dueDate < project.startDate) errors.dueDate = 'Due date must follow the start date.'
  return errors
}

export function validateTask(task) {
  const errors = {}
  if (!task.title?.trim()) errors.title = 'Task title is required.'
  if (!task.description?.trim()) errors.description = 'Description is required.'
  if (!task.projectId) errors.projectId = 'Project is required.'
  if (!task.dueDate) errors.dueDate = 'Due date is required.'
  return errors
}
