import React from 'react'

export default function Avatar({ user, size = 'md', title = true }) {
  const safeUser = user || { name: 'Unassigned', initials: '?' }
  return (
    <span className={`avatar avatar-${size}`} title={safeUser.name} aria-label={safeUser.name}>
      {safeUser.avatarUrl ? <img src={safeUser.avatarUrl} alt="" /> : safeUser.initials}
      {title && <span className="sr-only">{safeUser.name}</span>}
    </span>
  )
}
