import React, { createContext, useCallback, useEffect, useMemo, useReducer } from 'react'
import { authService } from '../services/authService'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import { userService } from '../services/userService'

export const WorkspaceContext = createContext(null)

const initialState = {
  status: 'loading',
  error: '',
  users: [],
  projects: [],
  tasks: [],
  session: null,
  toasts: [],
}

function reducer(state, action) {
  if (action.type === 'loaded') return { ...state, ...action.payload, status: 'success', error: '' }
  if (action.type === 'error') return { ...state, status: 'error', error: action.error }
  if (action.type === 'session') return { ...state, session: action.session }
  if (action.type === 'toast') return { ...state, toasts: [...state.toasts, action.toast] }
  if (action.type === 'dismiss-toast') return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) }
  return state
}

export default function WorkspaceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const refresh = useCallback(async () => {
    try {
      let session = await authService.getSession()
      if (!session) {
        dispatch({ type: 'loaded', payload: { users: [], projects: [], tasks: [], session: null } })
        return { users: [], projects: [], tasks: [] }
      }
      const [users, projects, tasks] = await Promise.all([
        userService.getAll(),
        projectService.getAll({ includeArchived: true }),
        taskService.getAll(),
      ])
      if (!users.some((user) => user.id === session.userId)) {
        await authService.logout()
        session = null
      }
      const workspace = { users, projects, tasks }
      dispatch({ type: 'loaded', payload: { ...workspace, session } })
      return workspace
    } catch (error) {
      dispatch({ type: 'error', error: error.message || 'Unable to load CollabBoard.' })
      throw error
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  useEffect(() => {
    const unauthorized = () => dispatch({ type: 'loaded', payload: { users: [], projects: [], tasks: [], session: null } })
    window.addEventListener('collabboard:unauthorized', unauthorized)
    return () => window.removeEventListener('collabboard:unauthorized', unauthorized)
  }, [])

  const toast = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    dispatch({ type: 'toast', toast: { id, message, tone } })
    window.setTimeout(() => dispatch({ type: 'dismiss-toast', id }), 3200)
  }, [])

  const mutate = useCallback(async (operation, successMessage) => {
    try {
      const result = await operation()
      await refresh()
      if (successMessage) toast(successMessage)
      return result
    } catch (error) {
      toast(error.message || 'Unable to save changes.', 'error')
      throw error
    }
  }, [refresh, toast])

  const actions = useMemo(() => ({
    login: (data) => mutate(() => authService.login(data), 'Welcome back to CollabBoard.'),
    register: (data) => mutate(() => authService.register(data), 'Your workspace account is ready.'),
    logout: async () => { await authService.logout(); dispatch({ type: 'session', session: null }) },
    createProject: (data) => mutate(() => projectService.create(data), 'Project created.'),
    updateProject: (id, data) => mutate(() => projectService.update(id, data), 'Project updated.'),
    toggleFavorite: (id) => mutate(() => projectService.toggleFavorite(id), 'Favorite updated.'),
    archiveProject: (id) => mutate(() => projectService.archive(id), 'Project archived.'),
    deleteProject: (id) => mutate(() => projectService.delete(id), 'Project deleted.'),
    createTask: (data) => mutate(() => taskService.create(data), 'Task created.'),
    updateTask: (id, data) => mutate(() => taskService.update(id, data), 'Task updated.'),
    updateTaskStatus: (id, status) => mutate(() => taskService.updateStatus(id, status), 'Task status updated.'),
    deleteTask: (id) => mutate(() => taskService.delete(id), 'Task deleted.'),
    updateUser: (id, data) => mutate(() => userService.update(id, data), 'Profile updated.'),
    refresh,
    toast,
    dismissToast: (id) => dispatch({ type: 'dismiss-toast', id }),
  }), [mutate, refresh, toast])

  const currentUser = state.users.find((user) => user.id === state.session?.userId) || null
  const value = useMemo(() => ({ ...state, currentUser, actions }), [state, currentUser, actions])

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
