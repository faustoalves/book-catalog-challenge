import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { InputGroup, InputGroupPrefix, InputGroupSuffix, InputGroupInput } from '../input-group'

describe('InputGroup', () => {
  it('renders children', () => {
    render(
      <InputGroup>
        <span>conteúdo</span>
      </InputGroup>,
    )
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('has relative positioning class', () => {
    render(
      <InputGroup data-testid="group">
        <span />
      </InputGroup>,
    )
    expect(screen.getByTestId('group').className).toContain('relative')
  })

  it('accepts custom className', () => {
    render(
      <InputGroup className="w-full" data-testid="group">
        <span />
      </InputGroup>,
    )
    expect(screen.getByTestId('group').className).toContain('w-full')
  })
})

describe('InputGroupPrefix', () => {
  it('renders children', () => {
    render(
      <InputGroup>
        <InputGroupPrefix>
          <span>ícone</span>
        </InputGroupPrefix>
        <InputGroupInput placeholder="x" />
      </InputGroup>,
    )
    expect(screen.getByText('ícone')).toBeInTheDocument()
  })

  it('is absolutely positioned', () => {
    render(
      <InputGroup>
        <InputGroupPrefix data-testid="prefix">
          <span />
        </InputGroupPrefix>
        <InputGroupInput placeholder="x" />
      </InputGroup>,
    )
    expect(screen.getByTestId('prefix').className).toContain('absolute')
  })
})

describe('InputGroupSuffix', () => {
  it('renders children', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="x" />
        <InputGroupSuffix>
          <span>sufixo</span>
        </InputGroupSuffix>
      </InputGroup>,
    )
    expect(screen.getByText('sufixo')).toBeInTheDocument()
  })
})

describe('InputGroupInput', () => {
  it('renders as an input', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Buscar" />
      </InputGroup>,
    )
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument()
  })
})
