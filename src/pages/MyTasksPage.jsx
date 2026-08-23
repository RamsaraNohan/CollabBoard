import React, { useMemo, useState } from 'react'
import Avatar from '../components/common/Avatar'
import Badge from '../components/common/Badge'

export default function MyTasksPage({ tasks, users, navigate }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const list = useMemo(() => tasks.filter((task) => {
    const matchesQuery = !query || task.title.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'all' || task.status === status)
  }), [tasks, query, status])
  const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }
  return (
    <div className="page-wrap">
      <header className="page-header"><div><p className="eyebrow">TASKS</p><h1>My Tasks</h1><p>A clean list view of tasks assigned across your CollabBoard workspace.</p></div></header>
      <section className="board-toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." /></div><label className="filter-select">Status <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option><option value="todo">To Do</option><option value="doing">Doing</option><option value="done">Done</option></select></label></section>
      <section className="task-table-card">
        <div className="task-table-head"><span>Task</span><span>Assignee</span><span>Status</span><span>Priority</span><span>Due</span></div>
        {list.map((task) => {
          const user = users.find((item) => item.id === task.assigneeId)
          return <button key={task.id} className="task-table-row" onClick={() => navigate('board')}><span><strong>{task.title}</strong><small>{task.labels.join(' · ')}</small></span><span className="table-assignee"><Avatar user={user} size="xs" title={false} />{user?.name}</span><span className={`status-text status-${task.status}`}>{task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done'}</span><span><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge></span><time>{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</time></button>
        })}
      </section>
    </div>
  )
}
