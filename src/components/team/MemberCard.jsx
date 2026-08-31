import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import WorkloadSummary from './WorkloadSummary'

export default function MemberCard({ member, metrics, projects = [], projectFilter = 'all', onAssign }) {
  return <article className="member-card"><div className="member-card-head"><Avatar user={member} size="lg" title={false} /><div><h2>{member.name}</h2><p>{member.role}</p><small>{member.studentId} · {member.email}</small></div></div><div className="collaborating-projects"><span>Collaborating Projects</span><div>{projects.map((project) => <small key={project.id}>{project.name}</small>)}</div></div><div className="member-stats member-stats-five">{[['assigned', 'Assigned'], ['todo', 'To Do'], ['doing', 'Doing'], ['done', 'Done'], ['overdue', 'Overdue']].map(([key, label]) => <div key={key}><strong>{metrics[key]}</strong><span>{label}</span></div>)}</div><WorkloadSummary metrics={metrics} /><div className="member-card-actions"><Link className="button button-secondary" to={`/members/${member.id}?project=${projectFilter}`}>View Details</Link><Button onClick={onAssign}>Assign Task</Button></div></article>
}
