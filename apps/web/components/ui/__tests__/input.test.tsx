import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Digite aqui" />)
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument()
  })

  it('renders with type text by default', () => {
    render(<Input placeholder="texto" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<Input placeholder="teste" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'novo valor' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('renders as disabled', () => {
    render(<Input disabled placeholder="desabilitado" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts custom className', () => {
    render(<Input className="minha-classe" placeholder="x" />)
    expect(screen.getByRole('textbox').className).toContain('minha-classe')
  })

  it('renders with type number', () => {
    render(<Input type="number" placeholder="123" />)
    expect(screen.getByPlaceholderText('123')).toHaveAttribute('type', 'number')
  })
})
