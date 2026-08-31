import React, { useEffect, useMemo, useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { PRIORITIES, PROJECT_ACCENTS } from '../../data/constants'
import { daysFromToday } from '../../utils/dates'
import { validateProject } from '../../utils/validation'

const blankProject = (currentUserId) => ({
  name: '',
  description: '',
  accent: 'blue',
  ownerId: currentUserId,
  memberIds: currentUserId ? [currentUserId] : [],
  startDate: daysFromToday(0),
  dueDate: daysFromToday(21),
  status: 'active',
  priority: 'medium',
})

export default function ProjectModal({ open, project, users, currentUserId, onClose, onSave }) {
  const initial = useMemo(() => project || blankProject(currentUserId), [project, currentUserId])
  const [form, setForm] = useState(initial)
  const [memberSearch, setMemberSearch] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) { setForm(project || blankProject(currentUserId)); setErrors({}); setMemberSearch('') }
  }, [open, project, currentUserId, users])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const ownerId = project?.ownerId || currentUserId
  const owner = users.find((user) => user.id === ownerId)
  const filteredUsers = users.filter((user) => `${user.name} ${user.studentId || ''} ${user.email}`.toLowerCase().includes(memberSearch.trim().toLowerCase()))
  const toggleMember = (id) => {
    if (id === ownerId) return
    update('memberIds', form.memberIds.includes(id) ? form.memberIds.filter((memberId) => memberId !== id) : [...form.memberIds, id])
  }
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validateProject(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    const { ownerId: _ignoredOwnerId, isFavorite: _ignoredFavorite, ...payload } = form
    payload.memberIds = [...new Set([ownerId, ...(payload.memberIds || [])])]
    try { await onSave(payload) } catch { /* WorkspaceProvider already presents the API error. */ } finally { setSaving(false) }
  }

  return (
    <Modal open={open} title={project ? 'Edit Project' : 'Create Project'} onClose={onClose}>
      <form className="project-form" onSubmit={submit}>
        <label className="field full"><span>Project name <b>*</b></span><input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Website Redesign" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
        <label className="field full"><span>Description</span><textarea rows="3" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="What will the team deliver?" /></label>
        <label className="field"><span>Accent</span><select value={form.accent} onChange={(event) => update('accent', event.target.value)}>{PROJECT_ACCENTS.map((accent) => <option key={accent} value={accent}>{accent[0].toUpperCase() + accent.slice(1)}</option>)}</select></label>
        <label className="field"><span>Owner</span><input value={owner?.name || ''} readOnly aria-readonly="true" /></label>
        <label className="field"><span>Start date</span><input type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} /></label>
        <label className="field"><span>Due date</span><input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} />{errors.dueDate && <small className="field-error">{errors.dueDate}</small>}</label>
        <label className="field"><span>Status</span><select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option></select></label>
        <label className="field"><span>Priority</span><select value={form.priority} onChange={(event) => update('priority', event.target.value)}>{PRIORITIES.map((priority) => <option key={priority.value} value={priority.value}>{priority.label}</option>)}</select></label>
        <fieldset className="member-picker full"><legend>Project members</legend><label className="member-search"><span className="sr-only">Search members</span><input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search by name, student ID or email" /></label><div>{filteredUsers.map((user) => <label key={user.id}><input type="checkbox" checked={form.memberIds.includes(user.id)} disabled={user.id === ownerId} onChange={() => toggleMember(user.id)} /><span>{user.name}<small>{user.studentId || user.email}{user.id === ownerId ? ' · Owner' : ''}</small></span></label>)}</div></fieldset>
        <div className="modal-actions full"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" loading={saving}>{project ? 'Save Changes' : 'Create Project'}</Button></div>
      </form>
    </Modal>
  )
}
