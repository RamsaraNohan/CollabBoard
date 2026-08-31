import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

export default function AsyncState({ state, status, title, message, error, empty = false, emptyTitle = 'Nothing here yet', emptyMessage = 'There is no information to show.', actionLabel, actionTo, onAction, onRetry, children }) {
  const mode = state || status || (empty ? 'empty' : '')
  if (!mode) return children
  const copy = {
    loading: ['Loading CollabBoard…', message || 'Preparing your workspace.'],
    error: [title || "We couldn't load this view.", message || error],
    empty: [title || emptyTitle, message || emptyMessage],
    'not-found': [title || 'Not found', message || 'The requested item is unavailable.'],
  }[mode] || [title, message]
  return <div className={`state-card state-${mode}`} role={mode === 'loading' ? 'status' : undefined}>{mode === 'loading' && <span className="spinner"></span>}<strong>{copy[0]}</strong>{copy[1] && <p>{copy[1]}</p>}{onRetry && <Button onClick={onRetry}>Retry</Button>}{onAction && <Button onClick={onAction}>{actionLabel}</Button>}{actionTo && <Link className="button button-primary" to={actionTo}>{actionLabel}</Link>}{children}</div>
}
