import React from 'react'
import Avatar from '../common/Avatar'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '⌂' },
  { key: 'boards', label: 'My Boards', icon: '▦' },
  { key: 'tasks', label: 'My Tasks', icon: '✓' },
  { key: 'team', label: 'Team', icon: '♙' },
]

export default function Sidebar({ currentPage, navigate, projects, currentUser, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="brand-row">
        <button className="logo-mark" onClick={() => navigate('dashboard')} aria-label="CollabBoard dashboard">
          <span></span><span></span><span></span><span></span>
        </button>
        {!collapsed && <button className="brand-text" onClick={() => navigate('dashboard')}>CollabBoard</button>}
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle navigation">☰</button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${currentPage === item.key || (item.key === 'boards' && currentPage === 'board') ? 'active' : ''}`}
            onClick={() => navigate(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="project-section">
          <div className="section-heading"><span>Projects</span><button aria-label="Add project">+</button></div>
          {projects.map((project) => (
            <button key={project.id} className="project-link" onClick={() => navigate('board')}>
              <span className={`project-dot ${project.accent}`}></span>
              {project.name}
            </button>
          ))}
        </div>
      )}

      <div className="sidebar-footer">
        <button className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => navigate('settings')}>
          <span className="nav-icon">⚙</span>
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="profile-chip" onClick={() => navigate('settings')}>
          <Avatar user={currentUser} size="sm" title={false} />
          {!collapsed && (
            <span className="profile-copy">
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
