import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BookCover from '../book-cover/BookCover'

describe('BookCover', () => {
  const imageUrl = 'https://example.com/cover.jpg'

  it('renders the main book cover image', () => {
    render(<BookCover imageUrl={imageUrl} alt="Livro teste" />)
    const imgs = screen.getAllByRole('img')
    const cover = imgs.find((img) => img.getAttribute('src') === imageUrl)
    expect(cover).toBeInTheDocument()
  })

  it('renders with correct alt text', () => {
    render(<BookCover imageUrl={imageUrl} alt="Meu livro" />)
    expect(screen.getByAltText('Meu livro')).toBeInTheDocument()
  })

  it('renders default alt text when not provided', () => {
    render(<BookCover imageUrl={imageUrl} />)
    expect(screen.getByAltText('Capa do livro')).toBeInTheDocument()
  })

  it('renders the overlay image', () => {
    render(<BookCover imageUrl={imageUrl} />)
    const allImgs = document.querySelectorAll('img')
    const overlay = Array.from(allImgs).find(
      (img) => img.getAttribute('src') === '/over_book_layer.png',
    )
    expect(overlay).toBeDefined()
  })

  it('renders shadow images', () => {
    render(<BookCover imageUrl={imageUrl} />)
    const allImgs = document.querySelectorAll('img')
    const srcs = Array.from(allImgs).map((img) => img.getAttribute('src'))
    expect(srcs).toContain('/right_book_shadow.png')
    expect(srcs).toContain('/bottom_book_shadow.png')
  })

  it('applies custom className to container', () => {
    const { container } = render(<BookCover imageUrl={imageUrl} className="minha-classe" />)
    expect(container.firstChild).toHaveClass('minha-classe')
  })

  it('renders four images total', () => {
    render(<BookCover imageUrl={imageUrl} />)
    expect(document.querySelectorAll('img')).toHaveLength(4)
  })
})
