import React, { useMemo, useState } from 'react'
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'
import Column from '../components/board/Column'
import TaskModal from '../components/board/TaskModal'
import DeleteModal from '../components/board/DeleteModal'

const statusLabels = { todo: 'To Do', doing: 'Doing', done: 'Done' }

export default function BoardPage({ tasks, setTasks, users }) {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('all')
  const [modal, setModal] = useState({ open: false, mode: 'add', task: null, defaultStatus: 'todo' })
  const [deleteTask, setDeleteTask] = useState(null)

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesSearch = !query || `${task.title} ${task.description} ${task.labels.join(' ')}`.toLowerCase().includes(query)
      const matchesPriority = priority === 'all' || task.priority === priority
      return matchesSearch && matchesPriority
    })
  }, [tasks, search, priority])

  const saveTask = (nextTask) => {
    if (nextTask.id) {
      setTasks((current) => current.map((task) => task.id === nextTask.id ? nextTask : task))
    } else {
      setTasks((current) => [...current, { ...nextTask, id: `t${Date.now()}` }])
    }
    setModal({ open: false, mode: 'add', task: null, defaultStatus: 'todo' })
  }

  const moveTask = (id, status) => setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
  const confirmDelete = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id))
    setDeleteTask(null)
  }

  return (
    <div className="page-wrap board-page-wrap">
      <header className="board-header">
        <div className="board-title-block">
          <p className="eyebrow">MY BOARDS / WEBSITE DEVELOPMENT</p>
          <div className="board-title-line"><h1>Website Development Project</h1><button className="icon-button star-button" aria-label="Favorite board">☆</button></div>
          <div className="board-subline"><span>Group 61</span><span className="separator">•</span><span>{users.length} members</span><div className="avatar-stack">{users.map((user) => <Avatar key={user.id} user={user} size="xs" title={false} />)}</div></div>
        </div>
        <Button onClick={() => setModal({ open: true, mode: 'add', task: null, defaultStatus: 'todo' })}>＋ Add Task</Button>
      </header>

      <section className="board-toolbar">
        <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks, labels, descriptions..." /></div>
        <div className="toolbar-right">
          <label className="filter-select">Filter priority <select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="all">All</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
          {(search || priority !== 'all') && <button className="link-button" onClick={() => { setSearch(''); setPriority('all') }}>Clear filters</button>}
        </div>
      </section>

      <section className="kanban-board" aria-label="CollabBoard Kanban board">
        {['todo', 'doing', 'done'].map((status) => (
          <Column
            key={status}
            status={status}
            title={statusLabels[status]}
            tasks={filteredTasks.filter((task) => task.status === status)}
            users={users}
            onEdit={(task) => setModal({ open: true, mode: 'edit', task, defaultStatus: task.status })}
            onDelete={setDeleteTask}
            onMove={moveTask}
            onAdd={(defaultStatus) => setModal({ open: true, mode: 'add', task: null, defaultStatus })}
          />
        ))}
      </section>

      <TaskModal
        open={modal.open}
        mode={modal.mode}
        task={modal.task}
        defaultStatus={modal.defaultStatus}
        users={users}
        onClose={() => setModal({ open: false, mode: 'add', task: null, defaultStatus: 'todo' })}
        onSave={saveTask}
      />
      <DeleteModal open={Boolean(deleteTask)} task={deleteTask} onClose={() => setDeleteTask(null)} onConfirm={confirmDelete} />
    </div>
  )
}
