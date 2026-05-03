import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { BookSuggestion } from '@book-catalog/shared'

const GOOGLE_BOOKS_PAGE_SIZE = 40

const searchQuery = z.object({
  q: z.string().optional(),
  autor: z.string().optional(),
  assunto: z.string().optional(),
  apenasPortugues: z.coerce.boolean().default(false),
  maxResults: z.coerce.number().int().positive().max(600).default(16),
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
  saleInfo?: {
    listPrice?: {
      amount: number
      currencyCode: string
    }
  }
}

interface GoogleBooksResponse {
  totalItems: number
  items?: GoogleVolume[]
}

function buildGoogleQuery(q?: string, autor?: string, assunto?: string): string {
  const parts: string[] = []
  if (q) parts.push(`intitle:${q}`)
  if (autor) parts.push(`inauthor:${autor}`)
  if (assunto) parts.push(`subject:${assunto}`)
  return parts.length ? parts.join('+') : 'books'
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
  const { id, volumeInfo, saleInfo } = volume
  const rawYear = volumeInfo.publishedDate
    ? parseInt(volumeInfo.publishedDate.slice(0, 4), 10)
    : null
  const anoPublicacao = rawYear && !isNaN(rawYear) ? rawYear : null
  const valor = saleInfo?.listPrice?.amount != null ? saleInfo.listPrice.amount.toFixed(2) : null

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
    valor,
  }
}

export async function googleBooksRoutes(app: FastifyInstance) {
  app.get('/google-books/search', async (request, reply) => {
    const { q, autor, assunto, apenasPortugues, maxResults } = searchQuery.parse(request.query)

    if (!q && !assunto && !autor) {
      return reply.status(400).send({ error: 'Informe ao menos um parâmetro: q, assunto ou autor' })
    }

    const apiKey = process.env['GOOGLE_BOOKS_API_KEY']
    const queryString = buildGoogleQuery(q, autor, assunto)

    function buildUrl(startIndex: number, pageSize: number): URL {
      const url = new URL('https://www.googleapis.com/books/v1/volumes')
      url.searchParams.set('q', queryString)
      url.searchParams.set('maxResults', String(pageSize))
      url.searchParams.set('startIndex', String(startIndex))
      url.searchParams.set('printType', 'books')
      if (apenasPortugues) url.searchParams.set('langRestrict', 'pt')
      if (apiKey) url.searchParams.set('key', apiKey)
      return url
    }

    const totalPages = Math.ceil(maxResults / GOOGLE_BOOKS_PAGE_SIZE)
    const pageRequests = Array.from({ length: totalPages }, (_, i) => ({
      start: i * GOOGLE_BOOKS_PAGE_SIZE,
      size: Math.min(GOOGLE_BOOKS_PAGE_SIZE, maxResults - i * GOOGLE_BOOKS_PAGE_SIZE),
    }))

    const responses = await Promise.all(
      pageRequests.map(({ start, size }) =>
        fetch(buildUrl(start, size)).then((r) => {
          if (!r.ok) throw new Error('Google Books API unavailable')
          return r.json() as Promise<GoogleBooksResponse>
        }),
      ),
    ).catch(() => null)

    if (!responses) {
      return reply.status(502).send({ error: 'Google Books API unavailable' })
    }

    const totalItems = responses[0]!.totalItems
    const collected = responses.flatMap((r) => r.items ?? [])

    return reply.send({ total: totalItems, items: collected.slice(0, maxResults).map(mapVolume) })
  })
}
