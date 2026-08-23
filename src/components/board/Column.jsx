import React from 'react'
import TaskCard from './TaskCard'

export default function Column({ status, title, tasks, users, onEdit, onDelete, onMove, onAdd }) {
  return (
    <section className={`kanban-column column-${status}`}>
      <div className="column-header">
        <div className="column-title-row">
          <span className="status-dot"></span>
          <h2>{title}</h2>
          <span className="count-pill">{tasks.length}</span>
        </div>
        <button className="icon-button compact" aria-label={`Add task to ${title}`} onClick={() => onAdd(status)}>+</button>
      </div>
      <div className="column-body">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            user={users.find((user) => user.id === task.assigneeId)}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
        {tasks.length === 0 && (
          <div className="empty-column">
            <strong>No tasks here</strong>
            <span>Move or add a task to this column.</span>
          </div>
        )}
      </div>
      <button className="add-task-inline" onClick={() => onAdd(status)}>＋ Add task</button>
    </section>
  )
}
