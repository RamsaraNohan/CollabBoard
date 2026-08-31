import React from 'react'
import Modal from '../common/Modal'
import TaskForm from '../tasks/TaskForm'

export default function TaskModal({ open, task, defaults, projects, users, onClose, onSave }) {
  return <Modal open={open} title={task ? 'Edit Task' : 'Add Task'} onClose={onClose}><TaskForm task={task} defaults={defaults} projects={projects} users={users} onCancel={onClose} onSave={onSave} /></Modal>
}
