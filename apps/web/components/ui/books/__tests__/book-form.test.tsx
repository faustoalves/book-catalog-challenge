import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookForm } from '../book-form/BookForm'
import type { BookFormData } from '@/context/AddBookContext'

vi.mock('@/lib/api', () => ({
  fetcher: vi.fn().mockResolvedValue([
    { codAs: 1, nome: 'Romance', slug: 'romance' },
    { codAs: 2, nome: 'Ficção', slug: 'ficcao' },
  ]),
}))

vi.mock('../book-cover/BookCover', () => ({
  default: ({ alt }: { alt: string }) => <img src="/mock.jpg" alt={alt} />,
}))

const defaultData: BookFormData = {
  titulo: 'Orgulho e Preconceito',
  autor: 'Jane Austen',
  editora: 'Via Leitura',
  paginas: '373',
  descricao: 'Uma história clássica.',
  imagemUrl: 'https://example.com/cover.jpg',
  assuntoCodAs: '1',
  valor: '29.90',
}

const onSubmit = vi.fn().mockResolvedValue(undefined)
const onBack = vi.fn()
const onDelete = vi.fn().mockResolvedValue(undefined)

describe('BookForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} />)
    })
    expect(screen.getByLabelText(/Nome do livro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nome do autor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Editora/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Preço sugerido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Páginas/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument()
  })

  it('pre-fills fields with initialData', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} />)
    })
    expect(screen.getByLabelText(/Nome do livro/i)).toHaveValue('Orgulho e Preconceito')
    expect(screen.getByLabelText(/Nome do autor/i)).toHaveValue('Jane Austen')
    expect(screen.getByLabelText(/Editora/i)).toHaveValue('Via Leitura')
  })

  it('renders "Confirmar e adicionar" button in add mode', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} />)
    })
    expect(screen.getByRole('button', { name: /Confirmar e adicionar/i })).toBeInTheDocument()
  })

  it('renders "Salvar alterações" button in edit mode', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} />)
    })
    expect(screen.getByRole('button', { name: /Salvar alterações/i })).toBeInTheDocument()
  })

  it('does NOT render delete button in add mode', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    expect(screen.queryByRole('button', { name: /Excluir/i })).not.toBeInTheDocument()
  })

  it('renders delete button in edit mode when onDelete is provided', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    expect(screen.getByRole('button', { name: /Excluir/i })).toBeInTheDocument()
  })

  it('opens delete dialog when delete button is clicked', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Excluir/i }))
    })
    expect(screen.getByText(/Excluir livro/i)).toBeInTheDocument()
  })

  it('shows delete confirmation input in dialog', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Excluir/i }))
    })
    expect(screen.getByPlaceholderText('deletar livro')).toBeInTheDocument()
  })

  it('confirm button is disabled when input is empty', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Excluir/i }))
    })
    expect(screen.getByRole('button', { name: /Confirmar exclusão/i })).toBeDisabled()
  })

  it('confirm button is disabled when input is wrong', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Excluir/i }))
    })
    fireEvent.change(screen.getByPlaceholderText('deletar livro'), { target: { value: 'errado' } })
    expect(screen.getByRole('button', { name: /Confirmar exclusão/i })).toBeDisabled()
  })

  it('confirm button is enabled when input matches "deletar livro"', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Excluir/i }))
    })
    fireEvent.change(screen.getByPlaceholderText('deletar livro'), {
      target: { value: 'deletar livro' },
    })
    expect(screen.getByRole('button', { name: /Confirmar exclusão/i })).not.toBeDisabled()
  })

  it('calls onDelete when confirmed with correct input', async () => {
    await act(async () => {
      render(
        <BookForm initialData={defaultData} mode="edit" onSubmit={onSubmit} onDelete={onDelete} />,
      )
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Excluir/i }))
    })
    fireEvent.change(screen.getByPlaceholderText('deletar livro'), {
      target: { value: 'deletar livro' },
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Confirmar exclusão/i }))
    })
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('renders back button when onBack is provided', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} onBack={onBack} />)
    })
    expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} onBack={onBack} />)
    })
    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('renders categories after fetch', async () => {
    await act(async () => {
      render(<BookForm initialData={defaultData} mode="add" onSubmit={onSubmit} />)
    })
    await waitFor(() => {
      expect(screen.getByText('Categoria')).toBeInTheDocument()
    })
  })
})
