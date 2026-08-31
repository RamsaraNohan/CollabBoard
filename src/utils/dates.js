const DAY_MS = 24 * 60 * 60 * 1000

export function startOfDay(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T00:00:00`)
  date.setHours(0, 0, 0, 0)
  return date
}

export function toDateInput(value) {
  const date = startOfDay(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(value, days) {
  return new Date(startOfDay(value).getTime() + days * DAY_MS)
}

export function daysFromToday(days, today = new Date()) {
  return toDateInput(addDays(today, days))
}

export function formatDate(value, options = {}) {
  if (!value) return 'No due date'
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    ...options,
  })
}

export function formatDateLong(value) {
  return formatDate(value, { year: 'numeric' })
}

export function isOverdue(task, today = new Date()) {
  return Boolean(task?.dueDate && task.status !== 'done' && startOfDay(task.dueDate) < startOfDay(today))
}

export function isDueToday(task, today = new Date()) {
  return Boolean(task?.dueDate && toDateInput(task.dueDate) === toDateInput(today))
}

export function dueState(task, today = new Date()) {
  if (task?.status === 'done') return 'completed'
  if (isOverdue(task, today)) return 'overdue'
  if (isDueToday(task, today)) return 'today'
  return 'upcoming'
}

export function isWithinNextDays(taskOrDate, days = 7, today = new Date()) {
  const dueDate = typeof taskOrDate === 'string' ? taskOrDate : taskOrDate?.dueDate
  if (!dueDate || taskOrDate?.status === 'done') return false
  const due = startOfDay(dueDate)
  const from = startOfDay(today)
  const to = addDays(from, days)
  return due >= from && due <= to
}
