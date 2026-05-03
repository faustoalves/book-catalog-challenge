import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Logo from '../logo/Logo'

describe('Logo', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('accepts className prop', () => {
    const { container } = render(<Logo className="h-8 w-auto" />)
    expect(container.querySelector('svg')).toHaveClass('h-8', 'w-auto')
  })

  it('passes SVG props through', () => {
    const { container } = render(<Logo data-testid="logo-svg" aria-label="Readlist" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-testid', 'logo-svg')
  })
})
