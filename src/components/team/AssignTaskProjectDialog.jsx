import React from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

export default function AssignTaskProjectDialog({ member, projects, onChoose, onClose }) {
  return <Modal open={Boolean(member)} title="Choose a shared project" onClose={onClose}>
    <div className="assign-project-dialog"><p>Select the project where you want to assign a task to <strong>{member?.name}</strong>.</p><div>{projects.map((project) => <Button key={project.id} variant="secondary" onClick={() => onChoose(project.id)}>{project.name}</Button>)}</div></div>
  </Modal>
}
