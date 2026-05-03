import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from '../label'

describe('Label', () => {
  it('renders children text', () => {
    render(<Label>Nome do livro</Label>)
    expect(screen.getByText('Nome do livro')).toBeInTheDocument()
  })

  it('renders as a label element', () => {
    render(<Label htmlFor="titulo">Título</Label>)
    const label = screen.getByText('Título')
    expect(label.tagName).toBe('LABEL')
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="input-test">Campo</Label>
        <input id="input-test" />
      </>,
    )
    expect(screen.getByLabelText('Campo')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    render(<Label className="minha-classe">Label</Label>)
    expect(screen.getByText('Label').className).toContain('minha-classe')
  })
})
