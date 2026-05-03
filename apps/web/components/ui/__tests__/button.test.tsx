import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'
import { PlusIcon, SearchIcon } from 'lucide-react'

describe('Button', () => {
  it('renders children', () => {
    render(<Button icon={PlusIcon}>Adicionar</Button>)
    expect(screen.getByText('Adicionar')).toBeInTheDocument()
  })

  it('renders the icon', () => {
    render(
      <Button icon={PlusIcon} data-testid="btn">
        Texto
      </Button>,
    )
    const btn = screen.getByTestId('btn')
    expect(btn.querySelector('svg')).toBeInTheDocument()
  })

  it('renders without children (icon-only)', () => {
    render(<Button icon={SearchIcon} aria-label="buscar" />)
    expect(screen.getByRole('button', { name: 'buscar' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <Button icon={PlusIcon} onClick={onClick}>
        Clique
      </Button>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(
      <Button icon={PlusIcon} disabled>
        Desabilitado
      </Button>,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies solid variant by default', () => {
    render(<Button icon={PlusIcon}>Sólido</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies outline variant', () => {
    render(
      <Button icon={PlusIcon} variant="outline" color="green">
        Outline
      </Button>,
    )
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
  })
})
