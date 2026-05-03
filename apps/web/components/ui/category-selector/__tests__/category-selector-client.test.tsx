import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CategorySelectorClient } from '../CategorySelectorClient'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../nav-select', async () => {
  const actual = await vi.importActual('../nav-select')
  return actual
})

const assuntos = [
  { nome: 'Romance', slug: 'romance' },
  { nome: 'Ficção Científica', slug: 'ficcao-cientifica' },
  { nome: 'Autoajuda', slug: 'autoajuda' },
]

describe('CategorySelectorClient', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders placeholder text', () => {
    render(<CategorySelectorClient assuntos={assuntos} />)
    expect(screen.getByText('Categorias')).toBeInTheDocument()
  })

  it('renders without errors when assuntos is empty', () => {
    render(<CategorySelectorClient assuntos={[]} />)
    expect(screen.getByText('Categorias')).toBeInTheDocument()
  })

  it('renders the trigger combobox', () => {
    render(<CategorySelectorClient assuntos={assuntos} />)
    // base-ui Select.Trigger renders with role="combobox"
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
