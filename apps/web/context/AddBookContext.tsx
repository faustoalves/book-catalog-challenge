'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type BookSuggestion = {
  googleId: string
  titulo: string
  autores: string[]
  editora: string | null
  paginas: number | null
  descricao: string | null
  imagemUrl: string | null
  assuntos: string[]
  valor: string | null
}

export type BookFormData = {
  titulo: string
  autor: string
  editora: string
  paginas: string
  descricao: string
  imagemUrl: string
  assuntoCodAs: string // ID do assunto como string (compatível com form inputs)
  valor: string
}

const defaultFormData: BookFormData = {
  titulo: '',
  autor: '',
  editora: '',
  paginas: '',
  descricao: '',
  imagemUrl: '',
  assuntoCodAs: '',
  valor: '',
}

type AddBookContextType = {
  step: 1 | 2 | 3
  searchTitulo: string
  searchAutor: string
  searchResults: BookSuggestion[]
  isSearching: boolean
  formData: BookFormData
  setStep: (step: 1 | 2 | 3) => void
  startSearch: (titulo: string, autor: string) => void
  setSearchResults: (results: BookSuggestion[]) => void
  setIsSearching: (value: boolean) => void
  selectBook: (book: BookSuggestion) => void
  updateFormData: (data: Partial<BookFormData>) => void
  reset: () => void
}

const AddBookContext = createContext<AddBookContextType | null>(null)

export function AddBookProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [searchTitulo, setSearchTitulo] = useState('')
  const [searchAutor, setSearchAutor] = useState('')
  const [searchResults, setSearchResults] = useState<BookSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [formData, setFormData] = useState<BookFormData>(defaultFormData)

  function startSearch(titulo: string, autor: string) {
    setSearchTitulo(titulo)
    setSearchAutor(autor)
    setStep(2)
  }

  function selectBook(book: BookSuggestion) {
    setFormData({
      titulo: book.titulo,
      autor: book.autores.join(', '),
      editora: book.editora ?? '',
      paginas: book.paginas?.toString() ?? '',
      descricao: book.descricao ?? '',
      imagemUrl: book.imagemUrl ?? '',
      assuntoCodAs: '', // não é possível mapear subjects do Google Books para IDs locais
      valor: book.valor ?? '',
    })
    setStep(3)
  }

  function updateFormData(data: Partial<BookFormData>) {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  function reset() {
    setStep(1)
    setSearchTitulo('')
    setSearchAutor('')
    setSearchResults([])
    setIsSearching(false)
    setFormData(defaultFormData)
  }

  return (
    <AddBookContext.Provider
      value={{
        step,
        searchTitulo,
        searchAutor,
        searchResults,
        isSearching,
        formData,
        setStep,
        startSearch,
        setSearchResults,
        setIsSearching,
        selectBook,
        updateFormData,
        reset,
      }}
    >
      {children}
    </AddBookContext.Provider>
  )
}

export function useAddBook() {
  const ctx = useContext(AddBookContext)
  if (!ctx) throw new Error('useAddBook must be used within AddBookProvider')
  return ctx
}
