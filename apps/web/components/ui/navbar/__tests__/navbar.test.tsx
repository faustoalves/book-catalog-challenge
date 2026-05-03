import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NavBar from '../Navbar'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/components/ui/category-selector/CategorySelector', () => ({
  default: () => <div data-testid="category-selector">Categorias</div>,
}))

vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>()
  return {
    ...actual,
    ASSUNTOS_LIST: [
      { nome: 'Romance', slug: 'romance' },
      { nome: 'Ficção', slug: 'ficcao' },
    ],
  }
})

describe('NavBar', () => {
  it('renders the logo link to home', () => {
    render(<NavBar />)
    const homeLinks = screen.getAllByRole('link').filter((l) => l.getAttribute('href') === '/')
    expect(homeLinks.length).toBeGreaterThan(0)
  })

  it('renders the search input', () => {
    render(<NavBar />)
    expect(screen.getByPlaceholderText(/Busque por titulo/i)).toBeInTheDocument()
  })

  it('renders the "Adicionar livro" link', () => {
    render(<NavBar />)
    expect(screen.getByRole('link', { name: /Adicionar livro/i })).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    render(<NavBar />)
    expect(screen.getByRole('button', { name: /Abrir menu/i })).toBeInTheDocument()
  })

  it('opens drawer when menu button is clicked', () => {
    render(<NavBar />)
    const menuBtn = screen.getByRole('button', { name: /Abrir menu/i })
    fireEvent.click(menuBtn)
    expect(screen.getByRole('button', { name: /Fechar menu/i })).toBeInTheDocument()
  })

  it('closes drawer when close button is clicked', () => {
    render(<NavBar />)
    fireEvent.click(screen.getByRole('button', { name: /Abrir menu/i }))
    fireEvent.click(screen.getByRole('button', { name: /Fechar menu/i }))
    expect(screen.queryByRole('button', { name: /Fechar menu/i })).not.toBeInTheDocument()
  })

  it('drawer contains category links', () => {
    render(<NavBar />)
    fireEvent.click(screen.getByRole('button', { name: /Abrir menu/i }))
    expect(screen.getByRole('link', { name: /Romance/i })).toBeInTheDocument()
  })
})
