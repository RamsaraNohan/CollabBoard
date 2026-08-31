import React from 'react'
import Drawer from '../common/Drawer'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import Badge from '../common/Badge'
import WorkloadSummary from './WorkloadSummary'
import { formatDate } from '../../utils/dates'

export default function MemberDrawer({ open, member, tasks, projects, metrics, contributions, collaboratingProjects = [], onClose, onAssign, onOpenTask }) {
  if (!member) return null
  return <Drawer open={open} title="Member Details" onClose={onClose}><div className="member-drawer-profile"><Avatar user={member} size="lg" title={false} /><div><h3>{member.name}</h3><p>{member.role}</p><small>Student ID {member.studentId} · {member.email}</small></div></div><section className="drawer-section collaborating-projects"><h3>Collaborating Projects</h3><div>{collaboratingProjects.map((project) => <small key={project.id}>{project.name}</small>)}</div></section><div className="member-metric-grid">{['assigned', 'todo', 'doing', 'done', 'overdue', 'completion'].map((key) => <div key={key}><strong>{metrics[key]}{key === 'completion' ? '%' : ''}</strong><span>{key}</span></div>)}</div><WorkloadSummary metrics={metrics} /><Button className="full-button" onClick={onAssign}>Assign Task</Button><section className="drawer-section"><h3>Project contribution</h3>{contributions.length ? contributions.map((entry) => <div className="contribution-row" key={entry.projectId}><span>{projects.find((project) => project.id === entry.projectId)?.name}</span><strong>{entry.count} tasks</strong></div>) : <p className="muted">No project contribution yet.</p>}</section><section className="drawer-section"><h3>Assigned tasks</h3>{tasks.length ? tasks.map((task) => <button className="drawer-task-row" key={task.id} onClick={() => onOpenTask(task)}><span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name}</small></span><span><Badge tone={task.status === 'done' ? 'success' : task.status === 'doing' ? 'blue' : 'neutral'}>{task.status}</Badge><small>{formatDate(task.dueDate)}</small></span></button>) : <p className="muted">No assigned tasks.</p>}</section></Drawer>
}
