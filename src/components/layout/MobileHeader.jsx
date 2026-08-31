import React from 'react'

export default function MobileHeader({ onOpen }) {
  return <header className="mobile-header"><button className="icon-button" aria-label="Open navigation" onClick={onOpen}>☰</button><div className="brand-lockup"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span><span>CollabBoard</span></div></header>
}
