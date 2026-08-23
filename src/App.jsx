import React, { useEffect, useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BoardsPage from './pages/BoardsPage'
import BoardPage from './pages/BoardPage'
import MyTasksPage from './pages/MyTasksPage'
import TeamPage from './pages/TeamPage'
import SettingsPage from './pages/SettingsPage'
import { initialTasks, projects, users } from './data/mockData'

const validPages = new Set(['login', 'register', 'dashboard', 'boards', 'board', 'tasks', 'team', 'settings'])
const pageFromHash = () => {
  const raw = window.location.hash.replace('#/', '').trim()
  return validPages.has(raw) ? raw : 'dashboard'
}

export default function App() {
  const [page, setPage] = useState(pageFromHash)
  const [tasks, setTasks] = useState(initialTasks)
  const currentUser = users[0]

  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.history.replaceState(null, '', '#/dashboard')
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (nextPage) => {
    const safe = validPages.has(nextPage) ? nextPage : 'dashboard'
    window.location.hash = `#/${safe}`
    setPage(safe)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (page === 'login') return <LoginPage navigate={navigate} />
  if (page === 'register') return <RegisterPage navigate={navigate} />

  let content
  if (page === 'dashboard') content = <DashboardPage tasks={tasks} users={users} navigate={navigate} />
  if (page === 'boards') content = <BoardsPage users={users} navigate={navigate} />
  if (page === 'board') content = <BoardPage tasks={tasks} setTasks={setTasks} users={users} />
  if (page === 'tasks') content = <MyTasksPage tasks={tasks} users={users} navigate={navigate} />
  if (page === 'team') content = <TeamPage users={users} tasks={tasks} />
  if (page === 'settings') content = <SettingsPage currentUser={currentUser} navigate={navigate} />

  return (
    <AppLayout currentPage={page} navigate={navigate} projects={projects} currentUser={currentUser}>
      {content}
    </AppLayout>
  )
}
