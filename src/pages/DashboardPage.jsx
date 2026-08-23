import React from 'react'
import Avatar from '../components/common/Avatar'
import Badge from '../components/common/Badge'

export default function DashboardPage({ tasks, users, navigate }) {
  const counts = {
    total: tasks.length,
    doing: tasks.filter((task) => task.status === 'doing').length,
    done: tasks.filter((task) => task.status === 'done').length,
    overdue: tasks.filter((task) => task.status !== 'done' && task.dueDate < '2026-08-23').length,
  }
  const stats = [
    ['Total Tasks', counts.total, 'View all tasks', 'blue'],
    ['In Progress', counts.doing, 'View in progress', 'purple'],
    ['Completed', counts.done, 'View completed', 'success'],
    ['Overdue', counts.overdue, 'Review overdue', 'danger'],
  ]
  const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }
  return (
    <div className="page-wrap">
      <header className="page-header">
        <div><p className="eyebrow">DASHBOARD</p><h1>Welcome to CollabBoard 👋</h1><p>Here's what's happening across Group 61's project workspace.</p></div>
        <button className="date-chip">◷ 23 Aug 2026</button>
      </header>
      <section className="stat-grid">
        {stats.map(([label, value, action, tone]) => (
          <button key={label} className="stat-card" onClick={() => navigate('tasks')}>
            <span className={`stat-icon tone-${tone}`}>{label === 'Total Tasks' ? '▦' : label === 'Completed' ? '✓' : label === 'Overdue' ? '!' : '↗'}</span>
            <small>{label}</small><strong>{value}</strong><span>{action} →</span>
          </button>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="panel-card">
          <div className="panel-title"><div><p className="eyebrow">WORK QUEUE</p><h2>Recent tasks</h2></div><button className="link-button" onClick={() => navigate('board')}>Open board →</button></div>
          <div className="task-list-compact">
            {tasks.slice(0, 6).map((task) => {
              const user = users.find((item) => item.id === task.assigneeId)
              return <button key={task.id} onClick={() => navigate('board')}><Avatar user={user} size="xs" title={false} /><span><strong>{task.title}</strong><small>{task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'Doing' : 'Done'} · {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</small></span><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge></button>
            })}
          </div>
        </article>
        <article className="panel-card">
          <div className="panel-title"><div><p className="eyebrow">UPCOMING</p><h2>Deadlines</h2></div><span className="muted">Next 7 days</span></div>
          <div className="deadline-list">
            {tasks.filter((task) => task.status !== 'done').slice(0, 5).map((task) => (
              <div key={task.id}><span className={`deadline-dot priority-${task.priority}`}></span><div><strong>{task.title}</strong><small>{task.labels[0] || 'TASK'}</small></div><time>{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</time></div>
            ))}
          </div>
          <div className="progress-card"><div><strong>Assignment 01 frontend</strong><span>Static UI completion</span></div><b>78%</b><div className="progress-track"><span style={{ width: '78%' }}></span></div></div>
        </article>
      </section>
    </div>
  )
}
