import React from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import MemberCard from '../components/team/MemberCard'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'
import { getMemberMetrics } from '../utils/selectors'

export default function ProjectMembersPage() {
  const { projectId } = useParams(); const { projects, tasks, users, currentUser } = useWorkspace(); const [, setParams] = useSearchParams(); const project = projects.find((item) => item.id === projectId && !item.archived)
  if (!project) return <AsyncState state="not-found" title="Project not found" message="This project may have been archived or deleted." actionLabel="Back to Projects" actionTo="/projects" />
  const members = users.filter((user) => project.memberIds.includes(user.id)); const projectTasks = tasks.filter((task) => task.projectId === project.id); const assign = (id) => setParams((current) => { const next = new URLSearchParams(current); next.set('create', 'task'); next.set('projectId', project.id); next.set('assigneeId', id); return next })
  return <div className="page-wrap"><header className="board-header"><div><p className="eyebrow">PROJECT MEMBERS</p><h1>{project.name}</h1><nav className="project-tabs"><Link to={`/projects/${project.id}/overview`}>Overview</Link><Link to={`/projects/${project.id}/board`}>Board</Link><Link className="active" to={`/projects/${project.id}/members`}>Members</Link></nav></div>{project.ownerId === currentUser?.id && <Button onClick={() => setParams((current) => { const next = new URLSearchParams(current); next.set('editProject', project.id); return next })}>Manage Members</Button>}</header><section className="team-grid">{members.map((member) => <MemberCard key={member.id} member={member} metrics={getMemberMetrics(projectTasks, member.id)} projects={[project]} projectFilter={project.id} onAssign={() => assign(member.id)} />)}</section></div>
}
