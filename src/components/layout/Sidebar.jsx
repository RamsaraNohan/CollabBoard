import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Avatar from '../common/Avatar'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/projects', label: 'My Projects', icon: '▦' },
  { to: '/my-tasks', label: 'My Tasks', icon: '✓' },
  { to: '/team', label: 'Team', icon: '♙' },
]

export default function Sidebar({ projects, currentUser, collapsed, mobileOpen, onToggle, onCloseMobile, onCreateProject }) {
  const location = useLocation()
  const activeProjectId = location.pathname.match(/^\/projects\/([^/]+)/)?.[1]
  const close = () => onCloseMobile?.()
  return <>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={close}></button>}
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand-row"><NavLink className="logo-mark" to="/dashboard" aria-label="CollabBoard dashboard" onClick={close}><span></span><span></span><span></span><span></span></NavLink>{!collapsed && <NavLink className="brand-text" to="/dashboard" onClick={close}>CollabBoard</NavLink>}<button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle navigation">☰</button><button className="sidebar-mobile-close icon-button" onClick={close} aria-label="Close navigation">×</button></div>
      <nav className="sidebar-nav" aria-label="Primary navigation">{navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={close} className={({ isActive }) => `nav-item ${isActive || (item.to === '/projects' && activeProjectId) ? 'active' : ''}`}><span className="nav-icon">{item.icon}</span>{!collapsed && <span>{item.label}</span>}</NavLink>)}</nav>
      {!collapsed && <div className="project-section"><div className="section-heading"><span>Projects</span><button aria-label="Create project" onClick={() => { onCreateProject(); close() }}>+</button></div>{projects.map((project) => <NavLink key={project.id} className={`project-link ${activeProjectId === project.id ? 'active' : ''}`} to={`/projects/${project.id}/board`} onClick={close}><span className={`project-dot ${project.accent}`}></span>{project.name}</NavLink>)}</div>}
      <div className="sidebar-footer"><NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to="/settings" onClick={close}><span className="nav-icon">⚙</span>{!collapsed && <span>Settings</span>}</NavLink><NavLink className="profile-chip" to="/settings" onClick={close}><Avatar user={currentUser} size="sm" title={false} />{!collapsed && <span className="profile-copy"><strong>{currentUser?.name}</strong><small>{currentUser?.role}</small></span>}</NavLink></div>
    </aside>
  </>
}
