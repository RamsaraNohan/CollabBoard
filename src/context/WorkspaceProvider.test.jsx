import React, { useEffect } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WorkspaceProvider from './WorkspaceProvider'
import { useWorkspace } from '../hooks/useWorkspace'
import { ApiError } from '../services/apiClient'

vi.mock('../services/authService', () => ({ authService: { getSession: vi.fn(), logout: vi.fn(), login: vi.fn(), register: vi.fn() } }))
vi.mock('../services/projectService', () => ({ projectService: { getAll: vi.fn() } }))
vi.mock('../services/taskService', () => ({ taskService: { getAll: vi.fn() } }))
vi.mock('../services/userService', () => ({ userService: { getAll: vi.fn() } }))

import { authService } from '../services/authService'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { userService } from '../services/userService'

let workspace

function Probe() {
  workspace = useWorkspace()
  return <div data-testid="state">{workspace.status}:{workspace.currentUser?.name || workspace.error}</div>
}

describe('WorkspaceProvider bootstrap', () => {
  beforeEach(() => {
    workspace = null
    vi.clearAllMocks()
    authService.getSession.mockResolvedValue({ userId: 'u1', token: 'token', isAuthenticated: true, rememberMe: true })
    projectService.getAll.mockResolvedValue([])
    taskService.getAll.mockResolvedValue([])
    userService.getAll.mockResolvedValue([{ id: 'u1', name: 'Current user' }])
  })

  it('turns an offline bootstrap into handled workspace error state', async () => {
    userService.getAll.mockRejectedValue(new ApiError('Unable to reach the CollabBoard API.'))
    render(<WorkspaceProvider><Probe /></WorkspaceProvider>)

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('error:Unable to reach'))
    await expect(workspace.actions.refresh()).resolves.toBeNull()
  })

  it('ignores stale refresh results when a newer request finishes first', async () => {
    let resolveFirst
    const firstUsers = new Promise((resolve) => { resolveFirst = resolve })
    userService.getAll
      .mockReturnValueOnce(firstUsers)
      .mockResolvedValueOnce([{ id: 'u1', name: 'Newest user' }])

    render(<WorkspaceProvider><Probe /></WorkspaceProvider>)
    await waitFor(() => expect(workspace).not.toBeNull())

    await act(async () => { await workspace.actions.refresh() })
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('success:Newest user'))

    await act(async () => { resolveFirst([{ id: 'u1', name: 'Stale user' }]); await firstUsers })
    expect(screen.getByTestId('state')).toHaveTextContent('success:Newest user')
  })
})
