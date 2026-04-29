import { count, desc, eq, ilike } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../db/index.js'
import { livros, type LivroInsert } from '../db/schema.js'

const createLivroBody = z.object({
  titulo: z.string().min(1),
  editora: z.string().optional(),
  edicao: z.number().int().positive().optional(),
  anoPublicacao: z.number().int().optional(),
  valor: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato inválido: use "29.99"'),
  imagemUrl: z.string().url().optional(),
  paginas: z.number().int().positive().optional(),
})

const updateLivroBody = createLivroBody.partial()

const listQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
})

function parseCodl(params: unknown): number {
  return parseInt((params as { codl: string }).codl, 10)
}

export async function livrosRoutes(app: FastifyInstance) {
  app.get('/livros', async (request, reply) => {
    const query = listQuery.parse(request.query)
    const offset = (query.page - 1) * query.limit
    const where = query.q ? ilike(livros.titulo, `%${query.q}%`) : undefined

    const [rows, [totalRow]] = await Promise.all([
      db
        .select()
        .from(livros)
        .where(where)
        .limit(query.limit)
        .offset(offset)
        .orderBy(desc(livros.codl)),
      db.select({ total: count() }).from(livros).where(where),
    ])

    return reply.send({
      data: rows,
      total: Number(totalRow!.total),
      page: query.page,
      limit: query.limit,
    })
  })

  app.get('/livros/:codl', async (request, reply) => {
    const [livro] = await db
      .select()
      .from(livros)
      .where(eq(livros.codl, parseCodl(request.params)))
      .limit(1)
    if (!livro) return reply.status(404).send({ error: 'Livro not found' })
    return reply.send(livro)
  })

  app.post('/livros', async (request, reply) => {
    const data = createLivroBody.parse(request.body) as LivroInsert
    const [livro] = await db.insert(livros).values(data).returning()
    return reply.status(201).send(livro)
  })

  app.put('/livros/:codl', async (request, reply) => {
    const data = updateLivroBody.parse(request.body)
    const [livro] = await db
      .update(livros)
      .set(data)
      .where(eq(livros.codl, parseCodl(request.params)))
      .returning()
    if (!livro) return reply.status(404).send({ error: 'Livro not found' })
    return reply.send(livro)
  })

  app.delete('/livros/:codl', async (request, reply) => {
    const [livro] = await db
      .delete(livros)
      .where(eq(livros.codl, parseCodl(request.params)))
      .returning()
    if (!livro) return reply.status(404).send({ error: 'Livro not found' })
    return reply.status(204).send()
  })
}
