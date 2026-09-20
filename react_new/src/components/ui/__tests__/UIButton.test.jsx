import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UIButton from '../UIButton/UIButton'

describe('UIButton', () => {
  it('renders children and handles click', () => {
    const onClick = vi.fn()
    render(<UIButton onClick={onClick}>Save</UIButton>)
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies variant class', () => {
    render(<UIButton variant="outline">Close</UIButton>)
    expect(screen.getByRole('button')).toHaveClass('ui-button-outline')
  })

  it('respects disabled', () => {
    const onClick = vi.fn()
    render(
      <UIButton disabled onClick={onClick}>
        Save
      </UIButton>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
