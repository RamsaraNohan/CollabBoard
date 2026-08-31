import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { useWorkspace } from '../hooks/useWorkspace'
import { DEMO_PASSWORD } from '../data/constants'
import { validateLogin } from '../utils/validation'

export default function LoginPage() {
  const { actions } = useWorkspace()
  const [form, setForm] = useState({ email: 'member1@example.com', password: DEMO_PASSWORD, rememberMe: false })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => { event.preventDefault(); const errors = validateLogin(form); if (Object.keys(errors).length) return setError(Object.values(errors)[0]); setSaving(true); setError(''); try { await actions.login(form) } catch (reason) { setError(reason.message) } finally { setSaving(false) } }
  return <div className="auth-page"><div className="auth-visual"><div className="auth-visual-inner"><div className="brand-lockup light-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div><p className="eyebrow light">GROUP 61 PROJECT</p><h1>Organize work.<br />Move together.</h1><p>Plan projects, track focused work, and keep every Group 61 contributor aligned.</p><div className="auth-board-mini" aria-hidden="true"><div><b>To Do</b><span></span><span></span></div><div><b>Doing</b><span></span></div><div><b>Done</b><span></span><span></span></div></div></div></div><div className="auth-form-side"><form className="auth-card" onSubmit={submit}><div className="mobile-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your workspace</h2><p className="muted">Development accounts use <strong>{DEMO_PASSWORD}</strong> as the password.</p><label className="field full"><span>Email</span><input type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label className="field full"><span>Password</span><input type="password" autoComplete="current-password" value={form.password} onChange={(event) => update('password', event.target.value)} /></label><label className="remember-option"><input type="checkbox" checked={form.rememberMe} onChange={(event) => update('rememberMe', event.target.checked)} />Remember me on this device</label>{error && <div className="form-alert" role="alert">{error}</div>}<Button type="submit" className="full-button" loading={saving}>Sign In</Button><p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p></form></div></div>
}
