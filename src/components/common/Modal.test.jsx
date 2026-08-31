import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  it('dismisses with Escape and returns focus to the invoking control', () => {
    const onClose = vi.fn()
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    const { rerender } = render(<Modal open title="Example" onClose={onClose}><button>Inside</button></Modal>)
    expect(screen.getByRole('dialog', { name: 'Example' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
    rerender(<Modal open={false} title="Example" onClose={onClose}><button>Inside</button></Modal>)
    expect(trigger).toHaveFocus()
    trigger.remove()
  })
})
