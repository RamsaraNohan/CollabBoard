import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { useWorkspace } from '../hooks/useWorkspace'
import { validateRegistration } from '../utils/validation'

export default function RegisterPage() {
  const { actions } = useWorkspace()
  const [form, setForm] = useState({ name: '', email: '', studentId: '', password: '', confirm: '', rememberMe: true })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => { event.preventDefault(); const errors = validateRegistration(form); if (Object.keys(errors).length) return setError(Object.values(errors)[0]); setSaving(true); setError(''); try { await actions.register(form) } catch (reason) { setError(reason.message) } finally { setSaving(false) } }
  return <div className="auth-page register-page"><div className="auth-visual register-visual"><div className="auth-visual-inner"><div className="brand-lockup light-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div><p className="eyebrow light">START COLLABORATING</p><h1>One shared board.<br />Clearer teamwork.</h1><p>Create your development account and enter the Group 61 workspace.</p><div className="feature-list"><span>✓ Project-specific boards</span><span>✓ Personal task planning</span><span>✓ Shared team visibility</span></div></div></div><div className="auth-form-side"><form className="auth-card" onSubmit={submit}><div className="mobile-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div><p className="eyebrow">CREATE ACCOUNT</p><h2>Join the workspace</h2><p className="muted">Create a development account for the Group 61 workspace.</p><label className="field full"><span>Full name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} /></label><label className="field full"><span>Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label className="field full"><span>Student ID</span><input value={form.studentId} onChange={(event) => update('studentId', event.target.value)} /></label><div className="two-field-row"><label className="field"><span>Password</span><input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /></label><label className="field"><span>Confirm password</span><input type="password" value={form.confirm} onChange={(event) => update('confirm', event.target.value)} /></label></div>{error && <div className="form-alert" role="alert">{error}</div>}<Button type="submit" className="full-button" loading={saving}>Create Account</Button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form></div></div>
}
