import React from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import AsyncState from '../components/common/AsyncState'
import { useWorkspace } from '../hooks/useWorkspace'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import BoardsPage from '../pages/BoardsPage'
import BoardPage from '../pages/BoardPage'
import MyTasksPage from '../pages/MyTasksPage'
import TeamPage from '../pages/TeamPage'
import SettingsPage from '../pages/SettingsPage'
import ProjectOverviewPage from '../pages/ProjectOverviewPage'
import ProjectMembersPage from '../pages/ProjectMembersPage'
import NotFoundPage from '../pages/NotFoundPage'

function ProtectedRoute() { const { session } = useWorkspace(); return session?.isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace /> }
function PublicOnly({ children }) { const { session } = useWorkspace(); return session?.isAuthenticated ? <Navigate to="/dashboard" replace /> : children }
function ProjectRedirect() { const { projectId } = useParams(); return <Navigate to={`/projects/${projectId}/overview`} replace /> }

export default function AppRoutes() {
  const { status, error, actions } = useWorkspace()
  if (status === 'loading') return <AsyncState state="loading" message="Loading your workspace…" />
  if (status === 'error') return <AsyncState state="error" title="Workspace unavailable" message={error} onRetry={actions.refresh} />
  return <Routes><Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} /><Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/projects" element={<BoardsPage />} /><Route path="/projects/:projectId" element={<ProjectRedirect />} /><Route path="/projects/:projectId/overview" element={<ProjectOverviewPage />} /><Route path="/projects/:projectId/board" element={<BoardPage />} /><Route path="/projects/:projectId/members" element={<ProjectMembersPage />} /><Route path="/my-tasks" element={<MyTasksPage />} /><Route path="/team" element={<TeamPage />} /><Route path="/members/:userId" element={<TeamPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="*" element={<NotFoundPage />} /></Route><Route path="/" element={<Navigate to="/dashboard" replace />} /></Routes>
}
