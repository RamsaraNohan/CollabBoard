import React, { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Avatar from '../components/common/Avatar'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'
import { formatDate, formatDateLong, isWithinNextDays } from '../utils/dates'
import { getProgress, getTaskCounts, sortTasks } from '../utils/selectors'

const priorityTone = { high: 'danger', medium: 'warning', low: 'success' }

export default function DashboardPage() {
  const { tasks, users, projects, currentUser } = useWorkspace()
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()
  const counts = getTaskCounts(tasks)
  const recent = sortTasks(tasks, 'updated').slice(0, 6)
  const upcoming = useMemo(() => tasks.filter((task) => task.status !== 'done' && isWithinNextDays(task.dueDate, 7)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5), [tasks])
  const stats = [['Total Tasks', counts.total, '/my-tasks?scope=all', 'blue', '▦'], ['In Progress', counts.doing, '/my-tasks?scope=all&status=doing', 'purple', '↗'], ['Completed', counts.done, '/my-tasks?scope=all&status=done', 'success', '✓'], ['Overdue', counts.overdue, '/my-tasks?scope=all&overdue=true', 'danger', '!']]
  const openTask = (task) => navigate(`/projects/${task.projectId}/board?task=${task.id}`)
  const create = (value) => setParams((current) => { const next = new URLSearchParams(current); next.set('create', value); return next })
  return <div className="page-wrap"><header className="page-header"><div><p className="eyebrow">DASHBOARD</p><h1>Welcome back, {currentUser?.name} 👋</h1><p>Here is what is happening across the Group 61 workspace.</p></div><div className="header-actions"><span className="date-chip">◷ {formatDateLong(new Date())}</span><Button variant="secondary" onClick={() => create('project')}>New Project</Button><Button onClick={() => create('task')}>New Task</Button></div></header><section className="stat-grid">{stats.map(([label, value, to, tone, icon]) => <button key={label} className="stat-card" onClick={() => navigate(to)}><span className={`stat-icon tone-${tone}`}>{icon}</span><small>{label}</small><strong>{value}</strong><span>View filtered tasks →</span></button>)}</section><section className="dashboard-grid"><article className="panel-card"><div className="panel-title"><div><p className="eyebrow">WORK QUEUE</p><h2>Recent tasks</h2></div><button className="link-button" onClick={() => navigate('/my-tasks')}>View all →</button></div>{recent.length ? <div className="task-list-compact">{recent.map((task) => { const user = users.find((item) => item.id === task.assigneeId); return <button key={task.id} onClick={() => openTask(task)}><Avatar user={user} size="xs" title={false} /><span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name} · {formatDate(task.dueDate)}</small></span><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge></button> })}</div> : <AsyncState state="empty" title="No recent tasks" message="Create the first task to populate your work queue." />}</article><article className="panel-card"><div className="panel-title"><div><p className="eyebrow">UPCOMING</p><h2>Deadlines</h2></div><span className="muted">Next 7 days</span></div>{upcoming.length ? <div className="deadline-list">{upcoming.map((task) => <button key={task.id} onClick={() => openTask(task)}><span className={`deadline-dot priority-${task.priority}`}></span><div><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name}</small></div><time>{formatDate(task.dueDate)}</time></button>)}</div> : <AsyncState state="empty" title="No deadlines this week" message="The upcoming seven days are clear." />}</article></section><section className="project-progress-panel panel-card"><div className="panel-title"><div><p className="eyebrow">PROJECT HEALTH</p><h2>Active project progress</h2></div><button className="link-button" onClick={() => navigate('/projects')}>All projects →</button></div><div className="project-progress-grid">{projects.filter((project) => !project.archived).map((project) => { const progress = getProgress(tasks.filter((task) => task.projectId === project.id)); return <button key={project.id} onClick={() => navigate(`/projects/${project.id}/overview`)}><span><strong>{project.name}</strong><small>{progress}% complete</small></span><span className="board-progress"><span style={{ width: `${progress}%` }}></span></span></button> })}</div></section></div>
}
