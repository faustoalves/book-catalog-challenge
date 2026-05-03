import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Escreva aqui" />)
    expect(screen.getByPlaceholderText('Escreva aqui')).toBeInTheDocument()
  })

  it('renders as a textarea element', () => {
    render(<Textarea placeholder="x" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<Textarea placeholder="x" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'texto longo' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('renders as disabled', () => {
    render(<Textarea disabled placeholder="x" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts rows prop', () => {
    render(<Textarea rows={6} placeholder="x" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
  })

  it('accepts custom className', () => {
    render(<Textarea className="minha-classe" placeholder="x" />)
    expect(screen.getByRole('textbox').className).toContain('minha-classe')
  })
})
