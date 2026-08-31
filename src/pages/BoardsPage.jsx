import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/common/Button'
import ProjectCard from '../components/projects/ProjectCard'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'
import { getProgress, getTaskCounts } from '../utils/selectors'

export default function BoardsPage() {
  const { projects, tasks, users, actions } = useWorkspace()
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()
  const active = projects.filter((project) => !project.archived)
  const setQuery = (key, value) => setParams((current) => { const next = new URLSearchParams(current); next.set(key, value); return next })
  return <div className="page-wrap"><header className="page-header"><div><p className="eyebrow">WORKSPACES</p><h1>My Projects</h1><p>Choose a project and continue collaborating with your team.</p></div><Button onClick={() => setQuery('create', 'project')}>＋ Create Project</Button></header>{active.length ? <section className="boards-grid">{active.map((project) => { const projectTasks = tasks.filter((task) => task.projectId === project.id); return <ProjectCard key={project.id} project={project} tasks={projectTasks} members={users.filter((user) => project.memberIds.includes(user.id))} progress={getProgress(projectTasks)} overdue={getTaskCounts(projectTasks).overdue} onOpen={() => navigate(`/projects/${project.id}/overview`)} onEdit={() => setQuery('editProject', project.id)} onFavorite={() => actions.toggleFavorite(project.id)} onArchive={() => actions.archiveProject(project.id)} onDelete={() => actions.deleteProject(project.id)} /> })}</section> : <AsyncState state="empty" title="No active projects" message="Create a project to start organizing work." actionLabel="Create Project" onAction={() => setQuery('create', 'project')} />}</div>
}
