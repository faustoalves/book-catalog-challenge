import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BookItem from '../book-item/BookItem'

vi.mock('../book-cover/BookCover', () => ({
  default: ({ alt }: { alt: string }) => <img src="/mock-cover.jpg" alt={alt} />,
}))

const mockBook = {
  slug: 'livro-teste',
  titulo: 'O Senhor dos Anéis',
  autor: 'J.R.R. Tolkien',
  imagemUrl: 'https://example.com/cover.jpg',
}

describe('BookItem', () => {
  it('renders the book title', () => {
    render(<BookItem {...mockBook} />)
    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument()
  })

  it('renders the author name', () => {
    render(<BookItem {...mockBook} />)
    expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument()
  })

  it('renders with null imagemUrl (uses fallback cover)', () => {
    render(<BookItem {...mockBook} imagemUrl={null} />)
    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument()
  })

  it('renders with null autor', () => {
    render(<BookItem {...mockBook} autor={null} />)
    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument()
  })

  it('renders BookCover with the book title as alt', () => {
    render(<BookItem {...mockBook} />)
    expect(screen.getByAltText('O Senhor dos Anéis')).toBeInTheDocument()
  })
})
