import React, { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', tone = 'danger', onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const confirm = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }
  return (
    <Modal open={open} title={title} onClose={onClose} width="470px">
      <div className="delete-copy">
        <div className="delete-icon">!</div>
        <p>{message}</p>
        <span>This action cannot be undone.</span>
      </div>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={tone} loading={loading} onClick={confirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
