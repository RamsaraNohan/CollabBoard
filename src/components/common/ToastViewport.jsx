import React from 'react'
import useWorkspace from '../../hooks/useWorkspace'

export default function ToastViewport() {
  const { toasts, actions } = useWorkspace()
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
          <span>{toast.tone === 'error' ? '!' : '✓'}</span>
          <p>{toast.message}</p>
          <button aria-label="Dismiss notification" onClick={() => actions.dismissToast(toast.id)}>×</button>
        </div>
      ))}
    </div>
  )
}
