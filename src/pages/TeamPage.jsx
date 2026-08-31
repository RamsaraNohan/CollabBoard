import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import MemberCard from '../components/team/MemberCard'
import MemberDrawer from '../components/team/MemberDrawer'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'
import { getMemberMetrics, getProjectContributions } from '../utils/selectors'

export default function TeamPage() {
  const { userId } = useParams()
  const { users, tasks, projects } = useWorkspace()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const member = users.find((user) => user.id === userId)
  if (userId && !member) return <AsyncState state="not-found" title="Member not found" message="This member is not part of the workspace." actionLabel="Back to Team" actionTo="/team" />
  const setQuery = (key, value, extras = {}) => setParams((current) => { const next = new URLSearchParams(current); next.set(key, value); Object.entries(extras).forEach(([name, item]) => next.set(name, item)); return next })
  const assign = (id) => setQuery('create', 'task', { assigneeId: id })
  return <div className="page-wrap"><header className="page-header"><div><p className="eyebrow">COLLABORATION</p><h1>Team</h1><p>Group 61 workload, progress, and project contribution.</p></div></header><section className="team-grid">{users.map((user) => <MemberCard key={user.id} member={user} metrics={getMemberMetrics(tasks, user.id)} onAssign={() => assign(user.id)} />)}</section>{member && <MemberDrawer open={!params.get('task') && !params.get('create') && !params.get('editTask')} member={member} tasks={tasks.filter((task) => task.assigneeId === member.id)} projects={projects} metrics={getMemberMetrics(tasks, member.id)} contributions={getProjectContributions(tasks, projects, member.id).map(({ project, count }) => ({ projectId: project.id, count }))} onClose={() => navigate('/team')} onAssign={() => assign(member.id)} onOpenTask={(task) => setQuery('task', task.id)} />}</div>
}
