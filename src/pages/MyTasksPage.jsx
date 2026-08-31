import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Badge from '../components/common/Badge'
import AsyncState from '../components/common/AsyncState'
import { LABELS, PRIORITIES, STATUSES } from '../data/constants'
import { useWorkspace } from '../hooks/useWorkspace'
import { dueState, formatDateLong } from '../utils/dates'
import { filterTasks, sortTasks } from '../utils/selectors'

const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }

export default function MyTasksPage() {
  const { tasks, projects, users, currentUser } = useWorkspace()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('query') || '')
  const status = params.get('status') || 'all'
  const priority = params.get('priority') || 'all'
  const projectId = params.get('project') || 'all'
  const label = params.get('label') || 'all'
  const overdue = params.get('overdue') === 'true'
  const sort = params.get('sort') || 'due'
  const scope = params.get('scope') || 'mine'
  const setFilter = (key, value) => setParams((current) => {
    const next = new URLSearchParams(current)
    if (value === 'all' || value === false || !value) next.delete(key)
    else next.set(key, String(value))
    return next
  })
  const list = useMemo(() => sortTasks(filterTasks(
    scope === 'all' ? tasks : tasks.filter((task) => task.assigneeId === currentUser?.id),
    { query, status, priority, projectId, label, overdue },
    users,
  ), sort), [tasks, currentUser, scope, query, status, priority, projectId, label, overdue, users, sort])

  return <div className="page-wrap">
    <header className="page-header"><div><p className="eyebrow">TASKS</p><h1>{scope === 'all' ? 'Workspace Tasks' : 'My Tasks'}</h1><p>{scope === 'all' ? 'All work across the Group 61 workspace.' : `Work assigned to ${currentUser?.name}, across every active project.`}</p></div></header>
    <section className="board-toolbar task-filter-toolbar">
      <div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search my tasks…" /></div>
      <select aria-label="Status" value={status} onChange={(event) => setFilter('status', event.target.value)}><option value="all">All statuses</option>{STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      <select aria-label="Priority" value={priority} onChange={(event) => setFilter('priority', event.target.value)}><option value="all">All priorities</option>{PRIORITIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      <select aria-label="Project" value={projectId} onChange={(event) => setFilter('project', event.target.value)}><option value="all">All projects</option>{projects.filter((project) => !project.archived).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
      <select aria-label="Label" value={label} onChange={(event) => setFilter('label', event.target.value)}><option value="all">All labels</option>{LABELS.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <select aria-label="Sort" value={sort} onChange={(event) => setFilter('sort', event.target.value)}><option value="due">Due date</option><option value="priority">Priority</option><option value="updated">Recently updated</option><option value="alpha">Alphabetical</option></select>
      <label className="overdue-filter"><input type="checkbox" checked={overdue} onChange={(event) => setFilter('overdue', event.target.checked)} />Overdue only</label>
    </section>
    {list.length ? <section className="task-table-card">
      <div className="task-table-head"><span>Task</span><span>Project</span><span>Status</span><span>Priority</span><span>Due</span></div>
      {list.map((task) => {
        const project = projects.find((item) => item.id === task.projectId)
        const state = dueState(task)
        return <article key={task.id} className={`task-table-row due-${state}`}>
          <button className="task-row-open" onClick={() => setFilter('task', task.id)}><strong>{task.title}</strong><small>{task.labels.join(' · ')}</small></button>
          <span><Link to={`/projects/${project?.id}/overview`}>{project?.name}</Link></span>
          <span className={`status-text status-${task.status}`}>{task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done'}</span>
          <span><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge></span>
          <time className={state === 'overdue' ? 'overdue-text' : ''}>{formatDateLong(task.dueDate)}</time>
        </article>
      })}
    </section> : <AsyncState state="empty" title="No matching tasks" message="Adjust your filters or assign a task to yourself." />}
  </div>
}
