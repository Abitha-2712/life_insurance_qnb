import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import UIText from '../UIText/UIText'

describe('UIText', () => {
  it('renders text with default variant', () => {
    render(<UIText>Hello</UIText>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as heading when as=h2', () => {
    render(
      <UIText as="h2" variant="h24SemiBold">
        Title
      </UIText>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument()
  })
})
