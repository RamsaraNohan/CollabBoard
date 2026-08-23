import React, { useEffect, useMemo, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

const blankTask = {
  title: '', description: '', status: 'todo', priority: 'medium', assigneeId: 'u1', dueDate: '2026-08-24', labels: [],
}

const labelOptions = ['FRONTEND', 'BACKEND', 'DATABASE', 'DESIGN', 'TESTING', 'DEVOPS', 'DOCUMENTATION']

export default function TaskModal({ open, mode, task, defaultStatus, users, onClose, onSave }) {
  const initial = useMemo(() => task || { ...blankTask, status: defaultStatus || 'todo' }, [task, defaultStatus])
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(task || { ...blankTask, status: defaultStatus || 'todo' })
      setErrors({})
    }
  }, [open, task, defaultStatus])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggleLabel = (label) => update('labels', form.labels.includes(label) ? form.labels.filter((item) => item !== label) : [...form.labels, label])

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Task title is required.'
    if (!form.description.trim()) nextErrors.description = 'Description is required.'
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave({ ...task, ...form, id: task?.id })
  }

  return (
    <Modal open={open} title={mode === 'edit' ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <form className="task-form" onSubmit={submit}>
        <label className="field full">
          <span>Task title <b>*</b></span>
          <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Build Login UI" />
          {errors.title && <small className="field-error">{errors.title}</small>}
        </label>
        <label className="field full">
          <span>Description <b>*</b></span>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows="4" placeholder="Describe the task and expected outcome." />
          {errors.description && <small className="field-error">{errors.description}</small>}
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="todo">To Do</option><option value="doing">Doing</option><option value="done">Done</option>
          </select>
        </label>
        <label className="field">
          <span>Priority</span>
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </label>
        <label className="field">
          <span>Assignee</span>
          <select value={form.assigneeId} onChange={(e) => update('assigneeId', e.target.value)}>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Due date <b>*</b></span>
          <input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
          {errors.dueDate && <small className="field-error">{errors.dueDate}</small>}
        </label>
        <fieldset className="label-picker full">
          <legend>Labels</legend>
          <div className="label-options">
            {labelOptions.map((label) => (
              <button key={label} type="button" className={form.labels.includes(label) ? 'selected' : ''} onClick={() => toggleLabel(label)}>{label}</button>
            ))}
          </div>
        </fieldset>
        <div className="modal-actions full">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{mode === 'edit' ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  )
}
