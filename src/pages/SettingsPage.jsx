import React, { useState } from 'react'
import Button from '../components/common/Button'
import Avatar from '../components/common/Avatar'

export default function SettingsPage({ currentUser, navigate }) {
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [saved, setSaved] = useState(false)
  return (
    <div className="page-wrap settings-wrap">
      <header className="page-header"><div><p className="eyebrow">ACCOUNT</p><h1>Settings</h1><p>Static profile settings for the Assignment 01 demonstration.</p></div></header>
      <section className="settings-card">
        <div className="settings-profile"><Avatar user={{ ...currentUser, name }} size="lg" title={false} /><div><h2>Profile information</h2><p>Update the mock account displayed in the interface.</p></div></div>
        <div className="settings-form"><label className="field"><span>Display name</span><input value={name} onChange={(e) => setName(e.target.value)} /></label><label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label></div>
        {saved && <div className="success-alert">Profile changes saved for this session.</div>}
        <div className="settings-actions"><Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}>Save Changes</Button><Button variant="secondary" onClick={() => navigate('login')}>Sign Out</Button></div>
      </section>
    </div>
  )
}
