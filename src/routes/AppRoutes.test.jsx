import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import WorkspaceProvider from '../context/WorkspaceProvider'
import { createSeedWorkspace } from '../data/seedData'
import { STORAGE_KEYS } from '../data/constants'
import AppRoutes from './AppRoutes'

describe('application routes', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(createSeedWorkspace(new Date('2026-08-31T00:00:00'))))
    window.sessionStorage.setItem(STORAGE_KEYS.temporarySession, JSON.stringify({ userId: 'u1', isAuthenticated: true, rememberMe: false }))
  })

  it('resolves a project-specific board route', async () => {
    render(<MemoryRouter initialEntries={['/projects/p2/board']}><WorkspaceProvider><AppRoutes /></WorkspaceProvider></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Mobile Application', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Mobile Application Kanban board' })).toBeInTheDocument()
    expect(screen.queryByText('Define Service Contracts')).not.toBeInTheDocument()
  })
})
