import React from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import ProjectOverview from '../components/projects/ProjectOverview'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'

export default function ProjectOverviewPage() {
  const { projectId } = useParams(); const { projects, tasks, users } = useWorkspace(); const [, setParams] = useSearchParams(); const project = projects.find((item) => item.id === projectId && !item.archived)
  if (!project) return <AsyncState state="not-found" title="Project not found" message="This project may have been archived or deleted." actionLabel="Back to Projects" actionTo="/projects" />
  const setQuery = (key, value, extras = {}) => setParams((current) => { const next = new URLSearchParams(current); next.set(key, value); Object.entries(extras).forEach(([name, item]) => next.set(name, item)); return next })
  return <div className="page-wrap"><header className="board-header"><div><p className="eyebrow">PROJECT OVERVIEW</p><h1>{project.name}</h1><p>{project.description}</p><nav className="project-tabs"><Link className="active" to={`/projects/${project.id}/overview`}>Overview</Link><Link to={`/projects/${project.id}/board`}>Board</Link><Link to={`/projects/${project.id}/members`}>Members</Link></nav></div><div className="header-actions"><Button variant="secondary" onClick={() => setQuery('editProject', project.id)}>Edit Project</Button><Button onClick={() => setQuery('create', 'task', { projectId: project.id })}>New Task</Button></div></header><ProjectOverview project={project} tasks={tasks.filter((task) => task.projectId === project.id)} members={users.filter((user) => project.memberIds.includes(user.id))} /></div>
}
