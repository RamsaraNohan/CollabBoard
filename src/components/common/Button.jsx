import React from 'react'

export default function Button({ children, variant = 'primary', className = '', loading = false, disabled, ...props }) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} disabled={disabled || loading} {...props}>
      {loading ? 'Please wait…' : children}
    </button>
  )
}
