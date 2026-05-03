import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TitleDescription from '../TitleDescription'

describe('TitleDescription', () => {
  it('renders title text', () => {
    render(<TitleDescription title="Meu Título" />)
    expect(screen.getByText('Meu Título')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<TitleDescription title="Título" description="Minha descrição" />)
    expect(screen.getByText('Minha descrição')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<TitleDescription title="Título" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders as h2 for small type', () => {
    render(<TitleDescription type="small" title="Título pequeno" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Título pequeno')
  })

  it('renders as h1 for medium type', () => {
    render(<TitleDescription type="medium" title="Título médio" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Título médio')
  })

  it('renders as h1 for large type', () => {
    render(<TitleDescription type="large" title="Título grande" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Título grande')
  })

  it('renders as h1 by default (no type prop)', () => {
    render(<TitleDescription title="Default" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<TitleDescription title="x" className="minha-classe" />)
    expect(container.firstChild).toHaveClass('minha-classe')
  })
})
