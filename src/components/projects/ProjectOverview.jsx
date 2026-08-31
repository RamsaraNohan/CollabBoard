import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import { formatDateLong } from '../../utils/dates'
import { getTaskCounts, getProgress } from '../../utils/selectors'

export default function ProjectOverview({ project, tasks, members }) {
  const counts = getTaskCounts(tasks)
  const progress = getProgress(tasks)
  return (
    <div className="project-overview-grid">
      <section className="panel-card project-summary-card">
        <div className="panel-title"><div><p className="eyebrow">PROJECT HEALTH</p><h2>{progress}% complete</h2></div><Badge tone={project.status === 'active' ? 'success' : 'neutral'}>{project.status}</Badge></div>
        <div className="overview-progress"><span style={{ width: `${progress}%` }}></span></div>
        <div className="overview-stats"><div><strong>{counts.total}</strong><span>Total</span></div><div><strong>{counts.doing}</strong><span>Doing</span></div><div><strong>{counts.done}</strong><span>Done</span></div><div><strong>{counts.overdue}</strong><span>Overdue</span></div></div>
      </section>
      <section className="panel-card"><p className="eyebrow">SCHEDULE</p><h2>Project details</h2><dl className="detail-list"><div><dt>Start</dt><dd>{formatDateLong(project.startDate)}</dd></div><div><dt>Due</dt><dd>{formatDateLong(project.dueDate)}</dd></div><div><dt>Priority</dt><dd>{project.priority}</dd></div></dl></section>
      <section className="panel-card overview-members"><div className="panel-title"><div><p className="eyebrow">COLLABORATORS</p><h2>{members.length} project members</h2></div><Link to={`/projects/${project.id}/members`}>View members →</Link></div><div className="overview-member-list">{members.map((member) => <Link key={member.id} to={`/members/${member.id}`}><Avatar user={member} size="sm" title={false} /><span><strong>{member.name}</strong><small>{member.role}</small></span></Link>)}</div></section>
    </div>
  )
}
