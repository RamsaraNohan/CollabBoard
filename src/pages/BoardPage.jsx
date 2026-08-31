import React, { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'
import Column from '../components/board/Column'
import ConfirmDialog from '../components/common/ConfirmDialog'
import AsyncState from '../components/common/AsyncState'
import { LABELS, PRIORITIES } from '../data/constants'
import { useWorkspace } from '../hooks/useWorkspace'
import { filterTasks } from '../utils/selectors'

const statusLabels = { todo: 'To Do', doing: 'Doing', done: 'Done' }

export default function BoardPage() {
  const { projectId } = useParams()
  const { projects, tasks, users, actions } = useWorkspace()
  const project = projects.find((item) => item.id === projectId && !item.archived)
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('all')
  const [assigneeId, setAssigneeId] = useState('all')
  const [label, setLabel] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [, setParams] = useSearchParams()
  const projectTasks = useMemo(() => filterTasks(tasks.filter((task) => task.projectId === projectId), { query, priority, assigneeId, label }, users), [tasks, projectId, query, priority, assigneeId, label, users])
  const setQueryParam = (key, value, extras = {}) => setParams((current) => { const next = new URLSearchParams(current); next.set(key, value); Object.entries(extras).forEach(([name, item]) => next.set(name, item)); return next })
  if (!project) return <AsyncState state="not-found" title="Project not found" message="This project may have been archived or deleted." actionLabel="Back to Projects" actionTo="/projects" />
  const members = users.filter((user) => project.memberIds.includes(user.id))
  return <div className="page-wrap board-page-wrap"><header className="board-header"><div className="board-title-block"><p className="eyebrow">MY PROJECTS / {project.name.toUpperCase()}</p><div className="board-title-line"><h1>{project.name}</h1><button className={`icon-button star-button ${project.isFavorite ? 'active' : ''}`} aria-label={project.isFavorite ? 'Unfavorite project' : 'Favorite project'} onClick={() => actions.toggleFavorite(project.id)}>{project.isFavorite ? '★' : '☆'}</button></div><div className="board-subline"><Link to={`/projects/${project.id}/overview`}>Overview</Link><span>•</span><Link className="active" to={`/projects/${project.id}/board`}>Board</Link><span>•</span><Link to={`/projects/${project.id}/members`}>Members</Link><div className="avatar-stack">{members.map((user) => <Avatar key={user.id} user={user} size="xs" title={false} />)}</div></div></div><Button onClick={() => setQueryParam('create', 'task', { projectId: project.id, status: 'todo' })}>＋ Add Task</Button></header><section className="board-toolbar multi-filter"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, labels, assignees…" /></div><div className="toolbar-right"><label className="filter-select"><span className="sr-only">Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="all">All priorities</option>{PRIORITIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="filter-select"><span className="sr-only">Assignee</span><select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}><option value="all">All assignees</option>{members.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><label className="filter-select"><span className="sr-only">Label</span><select value={label} onChange={(event) => setLabel(event.target.value)}><option value="all">All labels</option>{LABELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>{(query || priority !== 'all' || assigneeId !== 'all' || label !== 'all') && <button className="link-button" onClick={() => { setQuery(''); setPriority('all'); setAssigneeId('all'); setLabel('all') }}>Clear</button>}</div></section><section className="kanban-board" aria-label={`${project.name} Kanban board`}>{['todo', 'doing', 'done'].map((status) => <Column key={status} status={status} title={statusLabels[status]} tasks={projectTasks.filter((task) => task.status === status)} users={users} onOpen={(task) => setQueryParam('task', task.id)} onEdit={(task) => setQueryParam('editTask', task.id)} onDelete={setPendingDelete} onMove={(id, statusValue) => actions.updateTaskStatus(id, statusValue)} onAdd={(statusValue) => setQueryParam('create', 'task', { projectId: project.id, status: statusValue })} />)}</section><ConfirmDialog open={Boolean(pendingDelete)} title="Delete Task" message={pendingDelete ? `Delete ${pendingDelete.title}?` : ''} confirmLabel="Delete Task" onClose={() => setPendingDelete(null)} onConfirm={async () => { await actions.deleteTask(pendingDelete.id); setPendingDelete(null) }} /></div>
}
