import React, { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import MemberCard from '../components/team/MemberCard'
import MemberDrawer from '../components/team/MemberDrawer'
import AssignTaskProjectDialog from '../components/team/AssignTaskProjectDialog'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'
import { getActiveProjects, getCollaborators, getMemberMetrics, getProjectContributions, getSharedProjects, getTasksForProjects } from '../utils/selectors'

export default function TeamPage() {
  const { userId } = useParams()
  const { users, tasks, projects, currentUser } = useWorkspace()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [pendingAssign, setPendingAssign] = useState(null)
  const activeProjects = useMemo(() => getActiveProjects(projects), [projects])
  const requestedProject = params.get('project') || 'all'
  const projectFilter = requestedProject === 'all' || activeProjects.some((project) => project.id === requestedProject) ? requestedProject : 'all'
  const collaborators = useMemo(() => getCollaborators(users, activeProjects, currentUser?.id, projectFilter), [users, activeProjects, currentUser, projectFilter])
  const member = collaborators.find((user) => user.id === userId)

  const sharedProjectsFor = (memberId) => {
    const shared = getSharedProjects(activeProjects, currentUser?.id, memberId)
    return projectFilter === 'all' ? shared : shared.filter((project) => project.id === projectFilter)
  }
  const scopedTasksFor = (memberId) => getTasksForProjects(tasks, sharedProjectsFor(memberId)).filter((task) => task.assigneeId === memberId)
  const setQuery = (key, value, extras = {}) => setParams((current) => { const next = new URLSearchParams(current); next.set(key, value); Object.entries(extras).forEach(([name, item]) => next.set(name, item)); return next })
  const openTaskForm = (memberId, projectId) => setQuery('create', 'task', { assigneeId: memberId, projectId })
  const assign = (selectedMember) => {
    const shared = sharedProjectsFor(selectedMember.id)
    if (shared.length === 1) openTaskForm(selectedMember.id, shared[0].id)
    else if (shared.length > 1) setPendingAssign({ member: selectedMember, projects: shared })
  }
  const changeProject = (value) => setParams((current) => { const next = new URLSearchParams(current); next.set('project', value); return next }, { replace: true })
  const backToTeam = () => navigate(`/team?project=${projectFilter}`)

  if (userId && !member) return <AsyncState state="not-found" title="Member not found" message="This member does not share the selected project scope with you." actionLabel="Back to Team" actionTo={`/team?project=${projectFilter}`} />

  return <div className="page-wrap">
    <header className="page-header"><div><p className="eyebrow">COLLABORATION</p><h1>Team</h1><p>People who collaborate with you across shared projects.</p></div><label className="team-project-filter"><span>Project</span><select aria-label="Team project" value={projectFilter} onChange={(event) => changeProject(event.target.value)}><option value="all">All Collaborating Projects</option>{activeProjects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label></header>
    {collaborators.length ? <section className="team-grid">{collaborators.map((user) => { const shared = sharedProjectsFor(user.id); const memberTasks = scopedTasksFor(user.id); return <MemberCard key={user.id} member={user} metrics={getMemberMetrics(memberTasks, user.id)} projects={shared} projectFilter={projectFilter} onAssign={() => assign(user)} /> })}</section> : <AsyncState state="empty" title="No collaborators yet" message="Collaborators appear when you share a project." />}
    {member && (() => { const shared = sharedProjectsFor(member.id); const memberTasks = scopedTasksFor(member.id); return <MemberDrawer open={!params.get('task') && !params.get('create') && !params.get('editTask')} member={member} tasks={memberTasks} projects={shared} collaboratingProjects={shared} metrics={getMemberMetrics(memberTasks, member.id)} contributions={getProjectContributions(memberTasks, shared, member.id).map(({ project, count }) => ({ projectId: project.id, count }))} onClose={backToTeam} onAssign={() => assign(member)} onOpenTask={(task) => setQuery('task', task.id)} /> })()}
    <AssignTaskProjectDialog member={pendingAssign?.member} projects={pendingAssign?.projects || []} onClose={() => setPendingAssign(null)} onChoose={(projectId) => { openTaskForm(pendingAssign.member.id, projectId); setPendingAssign(null) }} />
  </div>
}
