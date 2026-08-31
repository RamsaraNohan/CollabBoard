import React from 'react'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import useOverlay from '../../hooks/useOverlay'
import { dueState, formatDate } from '../../utils/dates'

const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }
const labelTone = { FRONTEND: 'blue', BACKEND: 'purple', DATABASE: 'success', DESIGN: 'pink', TESTING: 'warning', DEVOPS: 'neutral', DOCUMENTATION: 'cyan' }

export default function TaskCard({ task, user, onOpen, onEdit, onDelete, onMove }) {
  const menu = useOverlay()
  const state = dueState(task)
  const choose = (action) => { menu.setOpen(false); action() }
  return (
    <article className={`task-card due-${state}`}>
      <div className="task-card-top">
        <div className="label-row">{task.labels.slice(0, 2).map((label) => <Badge key={label} tone={labelTone[label] || 'neutral'}>{label}</Badge>)}</div>
        <div className="task-menu-wrap" ref={menu.rootRef}>
          <button ref={menu.triggerRef} className="icon-button compact" aria-label={`Task menu for ${task.title}`} aria-expanded={menu.open} onClick={() => menu.setOpen((value) => !value)}>•••</button>
          {menu.open && <div className="task-menu" role="menu">
            <button role="menuitem" onClick={() => choose(() => onOpen(task))}>View Details</button>
            <button role="menuitem" onClick={() => choose(() => onEdit(task))}>Edit</button>
            <div className="menu-divider"></div><span className="menu-label">Move to</span>
            {['todo', 'doing', 'done'].filter((status) => status !== task.status).map((status) => <button role="menuitem" key={status} onClick={() => choose(() => onMove(task.id, status))}>→ {status === 'todo' ? 'To Do' : status === 'doing' ? 'Doing' : 'Done'}</button>)}
            <div className="menu-divider"></div><button role="menuitem" className="danger-text" onClick={() => choose(() => onDelete(task))}>Delete</button>
          </div>}
        </div>
      </div>
      <button className="task-card-main" onClick={() => onOpen(task)}>
        <h3>{task.title}</h3><p>{task.description}</p>
        <div className="task-meta-row"><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge><time className={state === 'overdue' ? 'overdue-text' : ''} dateTime={task.dueDate}>{state === 'overdue' ? '! ' : '◷ '}{formatDate(task.dueDate)}</time></div>
        <div className="assignee-row"><Avatar user={user} size="xs" title={false} /><span>{user?.name || 'Unassigned'}</span></div>
      </button>
    </article>
  )
}
