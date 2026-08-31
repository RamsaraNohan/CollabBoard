import React, { useEffect, useMemo, useState } from 'react'
import Button from '../common/Button'
import { LABELS, PRIORITIES, STATUSES } from '../../data/constants'
import { daysFromToday } from '../../utils/dates'
import { validateTask } from '../../utils/validation'

const blankTask = ({ projectId, status, assigneeId }) => ({
  title: '', description: '', projectId: projectId || '', status: status || 'todo', priority: 'medium', assigneeId: assigneeId || '', dueDate: daysFromToday(7), labels: [],
})
const EMPTY_DEFAULTS = {}

export default function TaskForm({ task, defaults = EMPTY_DEFAULTS, projects, users, onCancel, onSave }) {
  const initial = useMemo(() => task || blankTask(defaults), [task, defaults])
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const eligibleUsers = useMemo(() => {
    const project = projects.find((candidate) => candidate.id === form.projectId)
    return project ? users.filter((user) => project.memberIds.includes(user.id)) : []
  }, [form.projectId, projects, users])

  useEffect(() => { setForm(task || blankTask(defaults)); setErrors({}) }, [task, defaults])
  useEffect(() => {
    if (form.assigneeId && !eligibleUsers.some((user) => user.id === form.assigneeId)) {
      setForm((current) => ({ ...current, assigneeId: '' }))
    }
  }, [eligibleUsers, form.assigneeId])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updateProject = (projectId) => {
    const project = projects.find((candidate) => candidate.id === projectId)
    setForm((current) => ({
      ...current,
      projectId,
      assigneeId: project?.memberIds.includes(current.assigneeId) ? current.assigneeId : '',
    }))
  }
  const toggleLabel = (label) => update('labels', form.labels.includes(label) ? form.labels.filter((item) => item !== label) : [...form.labels, label])
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validateTask(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try { await onSave(form) } catch { /* WorkspaceProvider already presents the API error. */ } finally { setSaving(false) }
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <label className="field full"><span>Task title <b>*</b></span><input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Build Login UI" />{errors.title && <small className="field-error">{errors.title}</small>}</label>
      <label className="field full"><span>Description <b>*</b></span><textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows="4" placeholder="Describe the task and expected outcome." />{errors.description && <small className="field-error">{errors.description}</small>}</label>
      <label className="field"><span>Project <b>*</b></span>{task ? <input value={projects.find((project) => project.id === form.projectId)?.name || 'Unavailable project'} readOnly aria-readonly="true" /> : <select value={form.projectId} onChange={(event) => updateProject(event.target.value)}><option value="">Select project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>}{errors.projectId && <small className="field-error">{errors.projectId}</small>}</label>
      <label className="field"><span>Status</span><select value={form.status} onChange={(event) => update('status', event.target.value)}>{STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
      <label className="field"><span>Priority</span><select value={form.priority} onChange={(event) => update('priority', event.target.value)}>{PRIORITIES.map((priority) => <option key={priority.value} value={priority.value}>{priority.label}</option>)}</select></label>
      <label className="field"><span>Assignee</span><select value={form.assigneeId} onChange={(event) => update('assigneeId', event.target.value)}><option value="">Unassigned</option>{eligibleUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
      <label className="field"><span>Due date <b>*</b></span><input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} />{errors.dueDate && <small className="field-error">{errors.dueDate}</small>}</label>
      <fieldset className="label-picker full"><legend>Labels</legend><div className="label-options">{LABELS.map((label) => <button key={label} type="button" className={form.labels.includes(label) ? 'selected' : ''} aria-pressed={form.labels.includes(label)} onClick={() => toggleLabel(label)}>{label}</button>)}</div></fieldset>
      <div className="modal-actions full"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" loading={saving}>{task ? 'Save Changes' : 'Create Task'}</Button></div>
    </form>
  )
}
