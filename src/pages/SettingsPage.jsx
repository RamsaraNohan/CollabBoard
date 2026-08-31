import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Avatar from '../components/common/Avatar'
import { useWorkspace } from '../hooks/useWorkspace'

export default function SettingsPage() {
  const { currentUser, actions } = useWorkspace()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: currentUser.name, email: currentUser.email, role: currentUser.role })
  const [saving, setSaving] = useState(false)
  useEffect(() => setForm({ name: currentUser.name, email: currentUser.email, role: currentUser.role }), [currentUser])
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const save = async (event) => { event.preventDefault(); if (!form.name.trim() || !form.email.trim()) return actions.toast('Name and email are required.', 'error'); setSaving(true); try { await actions.updateUser(currentUser.id, form) } catch { /* WorkspaceProvider already presents the API error. */ } finally { setSaving(false) } }
  return <div className="page-wrap settings-wrap"><header className="page-header"><div><p className="eyebrow">ACCOUNT</p><h1>Settings</h1><p>Manage the profile used throughout your workspace.</p></div></header><form className="settings-card" onSubmit={save}><div className="settings-profile"><Avatar user={{ ...currentUser, name: form.name }} size="lg" title={false} /><div><h2>Profile information</h2><p>Changes update every current-user view.</p></div></div><div className="settings-form"><label className="field"><span>Display name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} /></label><label className="field"><span>Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label className="field full"><span>Role</span><input value={form.role} onChange={(event) => update('role', event.target.value)} /></label></div><div className="settings-actions"><Button type="submit" loading={saving}>Save Changes</Button><Button type="button" variant="secondary" onClick={async () => { await actions.logout(); navigate('/login', { replace: true }) }}>Sign Out</Button></div></form></div>
}
