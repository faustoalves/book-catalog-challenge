import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { db } from './index.js'
import { assuntos as assuntosTable, livros as livrosTable } from './schema.js'
import { slugify } from '../lib/slugify.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE_URL = 'http://localhost:3001/api'
const DELAY_MS = 5000

interface BookEntry {
  title: string
  author: string
}

interface CategoryEntry {
  category: string
  books: BookEntry[]
}

interface BookSuggestion {
  titulo: string
  autores: string[]
  editora: string | null
  anoPublicacao: number | null
  paginas: number | null
  imagemUrl: string | null
  descricao: string | null
  valor: string | null
}

function randomValor(): string {
  return (Math.random() * 100 + 50).toFixed(2)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function searchGoogleBooks(title: string, autor: string): Promise<BookSuggestion | null> {
  try {
    const params = new URLSearchParams({ q: title, autor, maxResults: '1' })
    const res = await fetch(`${BASE_URL}/google-books/search?${params}`)
    if (!res.ok) return null
    const data = (await res.json()) as { items: BookSuggestion[] }
    return data.items?.[0] ?? null
  } catch (err) {
    console.error(`   Erro na busca: ${err}`)
    return null
  }
}

async function createLivro(payload: object): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error(`   POST falhou (${res.status}): ${err}`)
    }
    return res.ok
  } catch (err) {
    console.error(`   Erro ao inserir: ${err}`)
    return false
  }
}

const catalogPath = resolve(__dirname, '../../livros_por_categoria.json')
const catalog: CategoryEntry[] = JSON.parse(readFileSync(catalogPath, 'utf-8'))

const assuntosDb = await db.select().from(assuntosTable)
const assuntoByNome = new Map(assuntosDb.map((a) => [a.nome, a.codAs]))

const livrosExistentes = await db.select({ slug: livrosTable.slug }).from(livrosTable)
const slugsExistentes = new Set(livrosExistentes.map((l) => l.slug).filter(Boolean))
console.log(`📖 ${slugsExistentes.size} livros já existentes na base — serão ignorados.\n`)

const MAX_BOOKS = parseInt(process.env['SEED_LIMIT'] ?? '0', 10) || Infinity
const SEED_CATEGORIES = process.env['SEED_CATEGORIES']
  ? process.env['SEED_CATEGORIES'].split(',').map((c) => c.trim())
  : null

const seenTitles = new Set<string>()
let inserted = 0
let skipped = 0
let notFound = 0
let total = 0

for (const category of catalog) {
  if (total >= MAX_BOOKS) break
  if (SEED_CATEGORIES && !SEED_CATEGORIES.includes(category.category)) continue
  const codAs = assuntoByNome.get(category.category)
  if (!codAs) {
    console.warn(`⚠️  Assunto não encontrado: ${category.category}`)
    continue
  }

  for (const book of category.books) {
    const key = `${book.title}::${book.author}`
    if (seenTitles.has(key)) {
      console.log(`⏭️  Duplicado, ignorando: "${book.title}"`)
      skipped++
      continue
    }
    seenTitles.add(key)
    total++
    if (total > MAX_BOOKS) break

    try {
      // Verificação rápida pelo título do JSON (evita chamada desnecessária à API)
      if (slugsExistentes.has(slugify(book.title))) {
        console.log(`⏭️  Já existe (JSON slug): "${book.title}"`)
        skipped++
        continue
      }

      console.log(`🔍 Buscando: "${book.title}" — ${book.author}`)
      const found = await searchGoogleBooks(book.title, book.author)

      if (!found) {
        console.warn(`❌ Não encontrado: "${book.title}"`)
        notFound++
        await delay(DELAY_MS)
        continue
      }

      // Verificação pelo título retornado pelo Google Books
      if (slugsExistentes.has(slugify(found.titulo))) {
        console.log(`⏭️  Já existe (Google slug): "${found.titulo}"`)
        skipped++
        await delay(DELAY_MS)
        continue
      }

      const payload = {
        titulo: found.titulo,
        editora: found.editora ?? undefined,
        anoPublicacao: found.anoPublicacao ?? undefined,
        paginas: found.paginas && found.paginas > 0 ? found.paginas : undefined,
        imagemUrl: found.imagemUrl ?? undefined,
        descricao: found.descricao ?? undefined,
        valor: found.valor ?? randomValor(),
        autores: found.autores,
        assuntos: [codAs],
      }

      const ok = await createLivro(payload)
      if (ok) {
        console.log(`✅ Inserido: "${found.titulo}"`)
        slugsExistentes.add(slugify(found.titulo))
        inserted++
      } else {
        console.warn(`❌ Erro ao inserir: "${found.titulo}"`)
        notFound++
      }
    } catch (err) {
      console.error(`   Erro inesperado em "${book.title}": ${err}`)
      notFound++
    }

    await delay(DELAY_MS)
  }
}

console.log(
  `\n📚 Concluído: ${inserted} inseridos | ${skipped} duplicados ignorados | ${notFound} não encontrados`,
)
process.exit(0)
