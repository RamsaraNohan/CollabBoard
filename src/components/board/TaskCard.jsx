import React, { useState } from 'react'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'

const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }
const labelTone = {
  FRONTEND: 'blue', BACKEND: 'purple', DATABASE: 'success', DESIGN: 'pink',
  TESTING: 'warning', DEVOPS: 'neutral', DOCUMENTATION: 'cyan',
}

export default function TaskCard({ task, user, onEdit, onDelete, onMove }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <article className="task-card">
      <div className="task-card-top">
        <div className="label-row">
          {task.labels.slice(0, 2).map((label) => (
            <Badge key={label} tone={labelTone[label] || 'neutral'}>{label}</Badge>
          ))}
        </div>
        <div className="task-menu-wrap">
          <button className="icon-button compact" aria-label={`Task menu for ${task.title}`} onClick={() => setMenuOpen((v) => !v)}>•••</button>
          {menuOpen && (
            <div className="task-menu">
              <button onClick={() => { setMenuOpen(false); onEdit(task) }}>✎ Edit</button>
              <div className="menu-divider"></div>
              <span className="menu-label">Move to</span>
              {['todo', 'doing', 'done'].filter((status) => status !== task.status).map((status) => (
                <button key={status} onClick={() => { setMenuOpen(false); onMove(task.id, status) }}>
                  → {status === 'todo' ? 'To Do' : status === 'doing' ? 'Doing' : 'Done'}
                </button>
              ))}
              <div className="menu-divider"></div>
              <button className="danger-text" onClick={() => { setMenuOpen(false); onDelete(task) }}>⌫ Delete</button>
            </div>
          )}
        </div>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-meta-row">
        <Badge tone={priorityTone[task.priority]}>{task.priority[0].toUpperCase() + task.priority.slice(1)}</Badge>
        <time dateTime={task.dueDate}>◷ {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</time>
      </div>
      <div className="assignee-row">
        <Avatar user={user} size="xs" title={false} />
        <span>{user?.name || 'Unassigned'}</span>
      </div>
    </article>
  )
}
