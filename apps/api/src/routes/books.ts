import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../db/index.js'
import { books } from '../db/schema.js'

const bookBody = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().optional(),
  description: z.string().optional(),
  coverUrl: z.string().url().optional(),
  genre: z.string().optional(),
  publishedAt: z.string().date().optional(),
})

const listQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
  genre: z.string().optional(),
})

export async function booksRoutes(app: FastifyInstance) {
  app.get('/books', async (request, reply) => {
    const query = listQuery.parse(request.query)
    const offset = (query.page - 1) * query.limit

    const where = (() => {
      const conditions = []
      if (query.q) {
        conditions.push(
          or(ilike(books.title, `%${query.q}%`), ilike(books.author, `%${query.q}%`))!,
        )
      }
      if (query.genre) {
        conditions.push(eq(books.genre, query.genre))
      }
      return conditions.length > 0 ? and(...conditions) : undefined
    })()

    const [rows, [totalRow]] = await Promise.all([
      db
        .select()
        .from(books)
        .where(where)
        .limit(query.limit)
        .offset(offset)
        .orderBy(desc(books.createdAt)),
      db.select({ total: count() }).from(books).where(where),
    ])

    return reply.send({
      data: rows,
      total: Number(totalRow!.total),
      page: query.page,
      limit: query.limit,
    })
  })

  app.get('/books/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1)
    if (!book) return reply.status(404).send({ error: 'Book not found' })
    return reply.send(book)
  })

  app.post('/books', async (request, reply) => {
    const data = bookBody.parse(request.body)
    const [book] = await db.insert(books).values(data).returning()
    return reply.status(201).send(book)
  })

  app.put('/books/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const data = bookBody.partial().parse(request.body)
    const [book] = await db
      .update(books)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning()
    if (!book) return reply.status(404).send({ error: 'Book not found' })
    return reply.send(book)
  })

  app.delete('/books/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const [book] = await db.delete(books).where(eq(books.id, id)).returning()
    if (!book) return reply.status(404).send({ error: 'Book not found' })
    return reply.status(204).send()
  })
}
