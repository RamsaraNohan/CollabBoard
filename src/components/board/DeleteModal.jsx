import React from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

export default function DeleteModal({ open, task, onClose, onConfirm }) {
  return (
    <Modal open={open} title="Delete Task" onClose={onClose} width="470px">
      <div className="delete-copy">
        <div className="delete-icon">!</div>
        <p>Are you sure you want to delete <strong>{task?.title}</strong>?</p>
        <span>This removes the task from the mock board for the current session.</span>
      </div>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => onConfirm(task?.id)}>Delete Task</Button>
      </div>
    </Modal>
  )
}
