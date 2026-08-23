import React, { useState } from 'react'
import Sidebar from './Sidebar'

export default function AppLayout({ children, currentPage, navigate, projects, currentUser }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        projects={projects}
        currentUser={currentUser}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <main className="main-panel">{children}</main>
    </div>
  )
}
