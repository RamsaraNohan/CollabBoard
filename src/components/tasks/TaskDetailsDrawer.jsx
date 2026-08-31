import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Drawer from '../common/Drawer'
import ConfirmDialog from '../common/ConfirmDialog'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { dueState, formatDateLong } from '../../utils/dates'

const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }

export default function TaskDetailsDrawer({ task, project, assignee, onClose, onEdit, onMove, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  if (!task || !project) return null
  const state = dueState(task)
  return (
    <>
      <Drawer open={!confirmDelete} title={task.title} onClose={onClose}>
        <div className="task-detail-heading"><div className="label-row">{task.labels.map((label) => <Badge key={label} tone="blue">{label}</Badge>)}</div><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge></div>
        <p className="task-detail-description">{task.description}</p>
        <dl className="detail-list task-detail-list">
          <div><dt>Status</dt><dd><span className={`status-text status-${task.status}`}>{task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done'}</span></dd></div>
          <div><dt>Project</dt><dd><Link to={`/projects/${project.id}/overview`}>{project.name}</Link></dd></div>
          <div><dt>Assignee</dt><dd className="detail-assignee"><Avatar user={assignee} size="xs" title={false} />{assignee?.name || 'Unassigned'}</dd></div>
          <div><dt>Due</dt><dd className={state === 'overdue' ? 'overdue-text' : ''}>{formatDateLong(task.dueDate)}{state === 'overdue' ? ' · Overdue' : state === 'today' ? ' · Due today' : ''}</dd></div>
        </dl>
        <div className="drawer-section"><h3>Move task</h3><div className="status-actions">{['todo', 'doing', 'done'].map((status) => <button key={status} className={task.status === status ? 'active' : ''} disabled={task.status === status} onClick={() => onMove(status)}>{status === 'todo' ? 'To Do' : status === 'doing' ? 'Doing' : 'Done'}</button>)}</div></div>
        <div className="drawer-actions"><Button onClick={() => onEdit(task)}>Edit Task</Button><Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete Task</Button></div>
      </Drawer>
      <ConfirmDialog open={confirmDelete} title="Delete Task" message={`Delete ${task.title}?`} confirmLabel="Delete Task" onClose={() => setConfirmDelete(false)} onConfirm={async () => { await onDelete(task.id); setConfirmDelete(false); onClose() }} />
    </>
  )
}
