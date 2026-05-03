import { count, desc, eq, ilike } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../db/index.js'
import { autores, assuntos, livroAutor, livroAssunto, livros } from '../db/schema.js'
import { slugify } from '../lib/slugify.js'

const createLivroBody = z.object({
  titulo: z.string().min(1),
  editora: z.string().optional(),
  edicao: z.number().int().positive().optional(),
  anoPublicacao: z.number().int().optional(),
  valor: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato inválido: use "29.99"'),
  imagemUrl: z.string().url().optional(),
  paginas: z.number().int().positive().optional(),
  descricao: z.string().optional(),
  autores: z.array(z.string().min(1)).default([]),
  assuntos: z.array(z.number().int().positive()).default([]),
})

const updateLivroBody = createLivroBody.partial()

const listQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
})

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

  app.get('/livros/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const [livro] = await db.select().from(livros).where(eq(livros.slug, slug)).limit(1)
    if (!livro) return reply.status(404).send({ error: 'Livro not found' })

    const categorias = await db
      .select({ nome: assuntos.nome, slug: assuntos.slug })
      .from(livroAssunto)
      .innerJoin(assuntos, eq(assuntos.codAs, livroAssunto.assuntoCodAs))
      .where(eq(livroAssunto.livroCodl, livro.codl))

    return reply.send({ ...livro, categorias })
  })

  app.post('/livros', async (request, reply) => {
    const {
      autores: autoresNomes,
      assuntos: assuntosCodigos,
      ...livroData
    } = createLivroBody.parse(request.body)

    const livro = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(livros)
        .values({ ...livroData, slug: slugify(livroData.titulo) })
        .returning()

      if (autoresNomes.length > 0) {
        const autorRecords = await Promise.all(
          autoresNomes.map(async (nome) => {
            const [autor] = await tx
              .insert(autores)
              .values({ nome })
              .onConflictDoUpdate({ target: autores.nome, set: { nome } })
              .returning()
            return autor!
          }),
        )
        await tx
          .insert(livroAutor)
          .values(autorRecords.map((a) => ({ livroCodl: inserted!.codl, autorCodAu: a.codAu })))
      }

      if (assuntosCodigos.length > 0) {
        await tx
          .insert(livroAssunto)
          .values(
            assuntosCodigos.map((codAs) => ({ livroCodl: inserted!.codl, assuntoCodAs: codAs })),
          )
      }

      return inserted
    })

    return reply.status(201).send(livro)
  })

  app.put('/livros/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const { autores: _, assuntos: __, ...livroData } = updateLivroBody.parse(request.body)
    const updates = livroData.titulo ? { ...livroData, slug: slugify(livroData.titulo) } : livroData
    const [livro] = await db.update(livros).set(updates).where(eq(livros.slug, slug)).returning()
    if (!livro) return reply.status(404).send({ error: 'Livro not found' })
    return reply.send(livro)
  })

  app.delete('/livros/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const [livro] = await db.select().from(livros).where(eq(livros.slug, slug)).limit(1)
    if (!livro) return reply.status(404).send({ error: 'Livro not found' })

    await db.transaction(async (tx) => {
      await tx.delete(livroAutor).where(eq(livroAutor.livroCodl, livro.codl))
      await tx.delete(livroAssunto).where(eq(livroAssunto.livroCodl, livro.codl))
      await tx.delete(livros).where(eq(livros.codl, livro.codl))
    })

    return reply.status(204).send()
  })
}
