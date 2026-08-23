import React from 'react'
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'

export default function TeamPage({ users, tasks }) {
  return (
    <div className="page-wrap">
      <header className="page-header"><div><p className="eyebrow">COLLABORATION</p><h1>Team</h1><p>Group 61 member overview for the CollabBoard static frontend.</p></div><Button>＋ Invite Member</Button></header>
      <section className="team-grid">
        {users.map((user) => {
          const assigned = tasks.filter((task) => task.assigneeId === user.id)
          const completed = assigned.filter((task) => task.status === 'done').length
          return <article key={user.id} className="member-card"><div className="member-top"><Avatar user={user} size="lg" title={false} /><button className="icon-button compact">•••</button></div><h2>{user.name}</h2><p>{user.role}</p><small>{user.email}</small><div className="member-stats"><div><strong>{assigned.length}</strong><span>Assigned</span></div><div><strong>{completed}</strong><span>Completed</span></div></div><button className="button button-secondary">View Tasks</button></article>
        })}
      </section>
    </div>
  )
}
