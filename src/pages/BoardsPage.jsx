import React from 'react'
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'

export default function BoardsPage({ users, navigate }) {
  const boards = [
    { name: 'Website Development Project', description: 'Group 61 full-stack workshop project.', tasks: 10, progress: 30, updated: 'Updated today' },
    { name: 'Mobile Application', description: 'Mock board included to demonstrate reusable board cards.', tasks: 7, progress: 45, updated: 'Updated yesterday' },
    { name: 'API Integration', description: 'Future service integration planning workspace.', tasks: 5, progress: 20, updated: 'Updated 2 days ago' },
  ]
  return (
    <div className="page-wrap">
      <header className="page-header"><div><p className="eyebrow">WORKSPACES</p><h1>My Boards</h1><p>Choose a project board and continue collaborating with your team.</p></div><Button onClick={() => navigate('board')}>＋ Create Board</Button></header>
      <section className="boards-grid">
        {boards.map((board, index) => (
          <button key={board.name} className="board-card" onClick={() => navigate('board')}>
            <div className={`board-cover cover-${index + 1}`}><span>▦</span></div>
            <div className="board-card-body"><div className="board-card-title"><h2>{board.name}</h2><span>•••</span></div><p>{board.description}</p><div className="board-card-meta"><span>{board.tasks} tasks</span><span>{board.progress}% complete</span></div><div className="board-progress"><span style={{ width: `${board.progress}%` }}></span></div><div className="board-card-footer"><div className="avatar-stack">{users.slice(0, 4).map((user) => <Avatar key={user.id} user={user} size="xs" title={false} />)}</div><small>{board.updated}</small></div></div>
          </button>
        ))}
      </section>
    </div>
  )
}
