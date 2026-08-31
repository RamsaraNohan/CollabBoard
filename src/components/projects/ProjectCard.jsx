import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import ProjectMenu from './ProjectMenu'
import { formatDate } from '../../utils/dates'

export default function ProjectCard({ project, tasks, members, progress, overdue, isOwner, onOpen, onEdit, onArchive, onDelete }) {
  return (
    <article className="board-card">
      <Link className={`board-cover cover-${project.accent}`} to={`/projects/${project.id}/board`} aria-label={`Open ${project.name} board`}><span>▦</span></Link>
      <div className="board-card-body">
        <div className="board-card-title"><div><Link to={`/projects/${project.id}/overview`}><h2>{project.name}</h2></Link><Badge tone={project.status === 'active' ? 'success' : 'neutral'}>{project.status}</Badge></div><ProjectMenu project={project} isOwner={isOwner} onOpen={onOpen} onEdit={onEdit} onArchive={onArchive} onDelete={onDelete} /></div>
        <p>{project.description}</p>
        <div className="board-card-meta"><span>{tasks.length} tasks · {overdue} overdue</span><span>{progress}% complete</span></div>
        <div className="board-progress"><span style={{ width: `${progress}%` }}></span></div>
        <div className="board-card-footer"><div className="avatar-stack">{members.slice(0, 5).map((user) => <Avatar key={user.id} user={user} size="xs" title={false} />)}</div><small>Due {formatDate(project.dueDate)}</small></div>
      </div>
    </article>
  )
}
