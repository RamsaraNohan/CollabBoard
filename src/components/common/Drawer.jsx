import React, { useEffect, useId, useRef } from 'react'

export default function Drawer({ open, title, onClose, children }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const returnFocusRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    returnFocusRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') onCloseRef.current() }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', onKeyDown)
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside ref={panelRef} className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex="-1" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-button" aria-label="Close details" onClick={onClose}>×</button>
        </div>
        <div className="drawer-content">{children}</div>
      </aside>
    </div>
  )
}
