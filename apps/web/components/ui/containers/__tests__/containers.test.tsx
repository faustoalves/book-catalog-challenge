import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BasicContainer from '../basic-container/BasicContainer'
import HeaderContainer from '../header-container/HeaderContainer'
import SliderContainer from '../slider-container/SliderContainer'

describe('BasicContainer', () => {
  it('renders children', () => {
    render(
      <BasicContainer>
        <p>Conteúdo básico</p>
      </BasicContainer>,
    )
    expect(screen.getByText('Conteúdo básico')).toBeInTheDocument()
  })

  it('renders as a section', () => {
    const { container } = render(
      <BasicContainer>
        <span />
      </BasicContainer>,
    )
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(
      <BasicContainer className="minha-classe">
        <span />
      </BasicContainer>,
    )
    expect(container.querySelector('section')).toHaveClass('minha-classe')
  })
})

describe('HeaderContainer', () => {
  it('renders children', () => {
    render(
      <HeaderContainer>
        <p>Conteúdo header</p>
      </HeaderContainer>,
    )
    expect(screen.getByText('Conteúdo header')).toBeInTheDocument()
  })

  it('renders as a section', () => {
    const { container } = render(
      <HeaderContainer>
        <span />
      </HeaderContainer>,
    )
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(
      <HeaderContainer className="custom">
        <span />
      </HeaderContainer>,
    )
    expect(container.querySelector('section')).toHaveClass('custom')
  })
})

describe('SliderContainer', () => {
  it('renders children', () => {
    render(
      <SliderContainer>
        <p>Conteúdo slider</p>
      </SliderContainer>,
    )
    expect(screen.getByText('Conteúdo slider')).toBeInTheDocument()
  })

  it('renders as a section', () => {
    const { container } = render(
      <SliderContainer>
        <span />
      </SliderContainer>,
    )
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(
      <SliderContainer className="custom">
        <span />
      </SliderContainer>,
    )
    expect(container.querySelector('section')).toHaveClass('custom')
  })
})
