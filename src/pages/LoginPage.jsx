import React, { useState } from 'react'
import Button from '../components/common/Button'

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState('member1@example.com')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) return setError('Enter both email and password to continue.')
    setError('')
    navigate('dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <div className="brand-lockup light-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div>
          <p className="eyebrow light">GROUP 61 PROJECT</p>
          <h1>Organize work.<br />Move together.</h1>
          <p>CollabBoard gives small teams a focused Kanban workspace for planning tasks, tracking progress, and collaborating clearly.</p>
          <div className="auth-board-mini" aria-hidden="true">
            <div><b>To Do</b><span></span><span></span></div>
            <div><b>Doing</b><span></span></div>
            <div><b>Done</b><span></span><span></span></div>
          </div>
        </div>
      </div>
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit}>
          <div className="mobile-brand"><span className="logo-mark static"><span></span><span></span><span></span><span></span></span>CollabBoard</div>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
          <p className="muted">Continue to your boards, tasks, and team activity.</p>
          <label className="field full"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field full password-field"><span>Password</span><div className="input-with-action"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
          <div className="auth-options"><label><input type="checkbox" /> Remember me</label><button type="button" className="link-button">Forgot password?</button></div>
          {error && <div className="form-alert">{error}</div>}
          <Button type="submit" className="full-button">Sign In</Button>
          <p className="auth-switch">Don't have an account? <button type="button" onClick={() => navigate('register')}>Register</button></p>
        </form>
      </div>
    </div>
  )
}
