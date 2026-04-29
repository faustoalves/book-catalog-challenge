export interface Book {
  id: string
  title: string
  author: string
  isbn: string | null
  description: string | null
  coverUrl: string | null
  genre: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBookDto {
  title: string
  author: string
  isbn?: string
  description?: string
  coverUrl?: string
  genre?: string
  publishedAt?: string
}

export type UpdateBookDto = Partial<CreateBookDto>

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface BooksQuery {
  page?: number
  limit?: number
  q?: string
  genre?: string
}

export interface BookSuggestion {
  googleId: string
  titulo: string
  autores: string[]
  editora: string | null
  anoPublicacao: number | null
  paginas: number | null
  descricao: string | null
  mainCategory: string | null
  imagemUrl: string | null
  assuntos: string[]
}

export interface GoogleBooksSearchResult {
  total: number
  items: BookSuggestion[]
}
