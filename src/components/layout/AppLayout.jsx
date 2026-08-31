import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'
import ProjectModal from '../projects/ProjectModal'
import TaskModal from '../board/TaskModal'
import TaskDetailsDrawer from '../tasks/TaskDetailsDrawer'
import ToastViewport from '../common/ToastViewport'
import { useWorkspace } from '../../hooks/useWorkspace'

export default function AppLayout() {
  const { projects, tasks, users, currentUser, actions } = useWorkspace()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const editProject = projects.find((item) => item.id === params.get('editProject'))
  const editTask = tasks.find((item) => item.id === params.get('editTask'))
  const detailTask = tasks.find((item) => item.id === params.get('task'))
  const defaults = useMemo(() => ({ projectId: params.get('projectId') || projects[0]?.id || '', status: params.get('status') || 'todo', assigneeId: params.get('assigneeId') || currentUser?.id || '' }), [params, projects, currentUser])
  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])
  const closeKeys = (...keys) => setParams((current) => { const next = new URLSearchParams(current); keys.forEach((key) => next.delete(key)); return next }, { replace: true })
  const setKey = (key, value) => setParams((current) => { const next = new URLSearchParams(current); next.set(key, value); return next })
  return <div className="app-shell">
    <Sidebar projects={projects.filter((project) => !project.archived)} currentUser={currentUser} collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed((value) => !value)} onCloseMobile={() => setMobileOpen(false)} onCreateProject={() => setKey('create', 'project')} />
    <div className="app-content"><MobileHeader onOpen={() => setMobileOpen(true)} /><main className="main-panel"><Outlet /></main></div>
    <ProjectModal open={params.get('create') === 'project' || Boolean(editProject)} project={editProject} users={users} currentUserId={currentUser?.id} onClose={() => closeKeys('create', 'editProject')} onSave={async (data) => { if (editProject) await actions.updateProject(editProject.id, data); else await actions.createProject(data); closeKeys('create', 'editProject') }} />
    <TaskModal open={params.get('create') === 'task' || Boolean(editTask)} task={editTask} defaults={defaults} projects={projects.filter((project) => !project.archived)} users={users} onClose={() => closeKeys('create', 'editTask', 'projectId', 'status', 'assigneeId')} onSave={async (data) => { if (editTask) await actions.updateTask(editTask.id, data); else await actions.createTask({ ...data, creatorId: currentUser?.id || null }); closeKeys('create', 'editTask', 'projectId', 'status', 'assigneeId') }} />
    <TaskDetailsDrawer open={Boolean(detailTask) && !editTask} task={detailTask} project={projects.find((item) => item.id === detailTask?.projectId)} assignee={users.find((item) => item.id === detailTask?.assigneeId)} onClose={() => closeKeys('task')} onEdit={() => setKey('editTask', detailTask.id)} onDelete={async () => { await actions.deleteTask(detailTask.id); closeKeys('task') }} onMove={(status) => actions.updateTaskStatus(detailTask.id, status)} onOpenProject={() => navigate(`/projects/${detailTask.projectId}/board?task=${detailTask.id}`)} />
    <ToastViewport />
  </div>
}
