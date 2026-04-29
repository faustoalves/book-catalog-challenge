import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { BookSuggestion } from '@book-catalog/shared'

const searchQuery = z.object({
  q: z.string().min(1),
  autor: z.string().optional(),
  maxResults: z.coerce.number().int().positive().max(40).default(10),
})

interface GoogleImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

interface GoogleVolume {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    pageCount?: number
    description?: string
    mainCategory?: string
    categories?: string[]
    imageLinks?: GoogleImageLinks
  }
}

interface GoogleBooksResponse {
  totalItems: number
  items?: GoogleVolume[]
}

function buildGoogleQuery(q: string, autor?: string): string {
  const parts = [`intitle:${q}`]
  if (autor) parts.push(`inauthor:${autor}`)
  return parts.join('+')
}

// Priority order from highest to lowest quality
const IMAGE_PRIORITY: (keyof GoogleImageLinks)[] = [
  'extraLarge',
  'large',
  'medium',
  'small',
  'thumbnail',
  'smallThumbnail',
]

function bestImageUrl(imageLinks?: GoogleImageLinks): string | null {
  if (!imageLinks) return null

  for (const size of IMAGE_PRIORITY) {
    const raw = imageLinks[size]
    if (raw) {
      return raw
        .replace('http://', 'https://')
        .replace(/&zoom=\d/, '&zoom=3')
        .replace('&edge=curl', '')
    }
  }

  return null
}

function mapVolume(volume: GoogleVolume): BookSuggestion {
  const { id, volumeInfo } = volume
  const rawYear = volumeInfo.publishedDate
    ? parseInt(volumeInfo.publishedDate.slice(0, 4), 10)
    : null
  const anoPublicacao = rawYear && !isNaN(rawYear) ? rawYear : null

  return {
    googleId: id,
    titulo: volumeInfo.title,
    autores: volumeInfo.authors ?? [],
    editora: volumeInfo.publisher ?? null,
    anoPublicacao,
    paginas: volumeInfo.pageCount ?? null,
    descricao: volumeInfo.description ?? null,
    mainCategory: volumeInfo.mainCategory ?? null,
    imagemUrl: bestImageUrl(volumeInfo.imageLinks),
    assuntos: volumeInfo.categories ?? [],
  }
}

export async function googleBooksRoutes(app: FastifyInstance) {
  app.get('/google-books/search', async (request, reply) => {
    const { q, autor, maxResults } = searchQuery.parse(request.query)

    const url = new URL('https://www.googleapis.com/books/v1/volumes')
    url.searchParams.set('q', buildGoogleQuery(q, autor))
    url.searchParams.set('maxResults', String(maxResults))
    url.searchParams.set('printType', 'books')

    const apiKey = process.env['GOOGLE_BOOKS_API_KEY']
    if (apiKey) url.searchParams.set('key', apiKey)

    const res = await fetch(url)

    if (!res.ok) {
      return reply.status(502).send({ error: 'Google Books API unavailable' })
    }

    const data = (await res.json()) as GoogleBooksResponse
    const items = (data.items ?? []).map(mapVolume)

    return reply.send({ total: data.totalItems, items })
  })
}
