import React, { useState } from 'react'
import useOverlay from '../../hooks/useOverlay'
import ConfirmDialog from '../common/ConfirmDialog'

export default function ProjectMenu({ project, isOwner, onOpen, onEdit, onArchive, onDelete }) {
  const { open, setOpen, rootRef, triggerRef } = useOverlay()
  const [confirm, setConfirm] = useState(null)
  const choose = (action) => { setOpen(false); action() }
  return (
    <div className="project-menu-wrap" ref={rootRef}>
      <button ref={triggerRef} className="icon-button compact" aria-label={`Project menu for ${project.name}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>•••</button>
      {open && <div className="task-menu project-menu" role="menu">
        <button role="menuitem" onClick={() => choose(onOpen)}>Open Project</button>
        {isOwner && <><button role="menuitem" onClick={() => choose(onEdit)}>Edit Project</button><div className="menu-divider"></div><button role="menuitem" onClick={() => choose(() => setConfirm('archive'))}>Archive</button><button role="menuitem" className="danger-text" onClick={() => choose(() => setConfirm('delete'))}>Delete</button></>}
      </div>}
      <ConfirmDialog open={Boolean(confirm)} title={confirm === 'delete' ? 'Delete Project' : 'Archive Project'} message={`${confirm === 'delete' ? 'Delete' : 'Archive'} ${project.name}?`} confirmLabel={confirm === 'delete' ? 'Delete Project' : 'Archive Project'} onClose={() => setConfirm(null)} onConfirm={async () => { await (confirm === 'delete' ? onDelete() : onArchive()); setConfirm(null) }} />
    </div>
  )
}
