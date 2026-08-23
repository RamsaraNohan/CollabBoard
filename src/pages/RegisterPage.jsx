import React, { useState } from 'react'
import Button from '../components/common/Button'

export default function RegisterPage({ navigate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    if (Object.values(form).some((value) => !value.trim())) return setError('Complete every field before creating your account.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setError('')
    navigate('dashboard')
  }
  return (
    <div className="auth-page register-page">
      <div className="auth-visual register-visual">
        <div className="auth-visual-inner">
          <div className="brand-lockup light-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div>
          <p className="eyebrow light">START COLLABORATING</p>
          <h1>One shared board.<br />Clearer teamwork.</h1>
          <p>Create an account and join your group workspace. This Assignment 01 version uses a static/mock frontend only.</p>
          <div className="feature-list"><span>✓ Responsive React UI</span><span>✓ Reusable components</span><span>✓ Mock Kanban interactions</span></div>
        </div>
      </div>
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit}>
          <div className="mobile-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div>
          <p className="eyebrow">CREATE ACCOUNT</p>
          <h2>Join your team workspace</h2>
          <p className="muted">Use sample information for the static frontend demonstration.</p>
          <label className="field full"><span>Full name</span><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" /></label>
          <label className="field full"><span>Email</span><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="name@example.com" /></label>
          <div className="two-field-row">
            <label className="field"><span>Password</span><input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} /></label>
            <label className="field"><span>Confirm password</span><input type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} /></label>
          </div>
          {error && <div className="form-alert">{error}</div>}
          <Button type="submit" className="full-button">Create Account</Button>
          <p className="auth-switch">Already have an account? <button type="button" onClick={() => navigate('login')}>Sign in</button></p>
        </form>
      </div>
    </div>
  )
}
