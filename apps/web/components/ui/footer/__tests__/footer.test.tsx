import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Footer from '../Footer'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument()
  })

  it('renders the logo', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('logo links to home', () => {
    render(<Footer />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })
})
