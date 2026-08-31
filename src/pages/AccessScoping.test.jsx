import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TeamPage from './TeamPage'
import TaskForm from '../components/tasks/TaskForm'
import ProjectMenu from '../components/projects/ProjectMenu'

let workspace
vi.mock('../hooks/useWorkspace', () => ({ useWorkspace: () => workspace }))

const users = [
  { id: 'u1', name: 'Current User', initials: 'CU', role: 'Owner', studentId: '1', email: 'u1@example.com' },
  { id: 'u2', name: 'Shared Member', initials: 'SM', role: 'Member', studentId: '2', email: 'u2@example.com' },
  { id: 'u3', name: 'Unrelated Member', initials: 'UM', role: 'Member', studentId: '3', email: 'u3@example.com' },
]
const projects = [
  { id: 'p1', name: 'Shared Project', ownerId: 'u1', memberIds: ['u1', 'u2'], archived: false },
  { id: 'p2', name: 'Other Project', ownerId: 'u1', memberIds: ['u1', 'u3'], archived: false },
]

function renderTeam(path = '/team') {
  return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/team" element={<TeamPage />} /><Route path="/members/:userId" element={<TeamPage />} /></Routes></MemoryRouter>)
}

describe('access-scoped frontend behavior', () => {
  beforeEach(() => {
    workspace = { users, projects, tasks: [], currentUser: users[0] }
  })

  it('shows no global-directory users when there are no shared projects', () => {
    workspace = { ...workspace, projects: [] }
    renderTeam()
    expect(screen.getByText('No collaborators yet')).toBeInTheDocument()
    expect(screen.queryByText('Unrelated Member')).not.toBeInTheDocument()
  })

  it('filters Team collaborators by the selected project', () => {
    renderTeam('/team?project=p1')
    expect(screen.getByText('Shared Member')).toBeInTheDocument()
    expect(screen.queryByText('Unrelated Member')).not.toBeInTheDocument()
    expect(screen.getAllByText('Shared Project')).toHaveLength(2)
  })

  it('renders the project as read-only while editing a task', () => {
    render(<TaskForm task={{ id: 't1', projectId: 'p1', title: 'Task', description: 'Description', status: 'todo', priority: 'medium', assigneeId: 'u2', dueDate: '2026-09-10', labels: [] }} projects={projects} users={users} onCancel={() => {}} onSave={() => {}} />)
    expect(screen.getByDisplayValue('Shared Project')).toHaveAttribute('readonly')
    expect(screen.queryByRole('combobox', { name: /project/i })).not.toBeInTheDocument()
  })

  it('hides owner-only project actions from members', () => {
    render(<ProjectMenu project={projects[0]} isOwner={false} onOpen={() => {}} onEdit={() => {}} onArchive={() => {}} onDelete={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /project menu/i }))
    expect(screen.getByRole('menuitem', { name: 'Open Project' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Edit Project' })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Archive' })).not.toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Delete' })).not.toBeInTheDocument()
  })
})
