import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import WorkloadSummary from './WorkloadSummary'

export default function MemberCard({ member, metrics, onAssign }) {
  return <article className="member-card"><div className="member-card-head"><Avatar user={member} size="lg" title={false} /><div><h2>{member.name}</h2><p>{member.role}</p><small>{member.studentId} · {member.email}</small></div></div><div className="member-stats"><div><strong>{metrics.assigned}</strong><span>Assigned</span></div><div><strong>{metrics.done}</strong><span>Done</span></div><div><strong>{metrics.completion}%</strong><span>Complete</span></div></div><WorkloadSummary metrics={metrics} /><div className="member-card-actions"><Link className="button button-secondary" to={`/members/${member.id}`}>View Details</Link><Button onClick={onAssign}>Assign Task</Button></div></article>
}
