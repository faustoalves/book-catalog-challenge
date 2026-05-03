import { asc, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { db } from '../db/index.js'
import { assuntos, autores, livroAssunto, livroAutor, livros } from '../db/schema.js'

export async function assuntosRoutes(app: FastifyInstance) {
  app.get('/assuntos', async (_request, reply) => {
    const rows = await db
      .select({ nome: assuntos.nome, slug: assuntos.slug })
      .from(assuntos)
      .orderBy(asc(assuntos.nome))

    return reply.send(rows)
  })

  app.get('/assuntos/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }

    const [assunto] = await db
      .select({
        nome: assuntos.nome,
        slug: assuntos.slug,
        descricao: assuntos.descricao,
      })
      .from(assuntos)
      .where(eq(assuntos.slug, slug))
      .limit(1)

    if (!assunto) return reply.status(404).send({ error: 'Assunto not found' })

    const rows = await db
      .select({
        slug: livros.slug,
        titulo: livros.titulo,
        imagemUrl: livros.imagemUrl,
        codl: livros.codl,
        autorNome: autores.nome,
      })
      .from(livroAssunto)
      .innerJoin(livros, eq(livros.codl, livroAssunto.livroCodl))
      .innerJoin(assuntos, eq(assuntos.codAs, livroAssunto.assuntoCodAs))
      .leftJoin(livroAutor, eq(livroAutor.livroCodl, livros.codl))
      .leftJoin(autores, eq(autores.codAu, livroAutor.autorCodAu))
      .where(eq(assuntos.slug, slug))
      .orderBy(asc(livros.codl))

    // Agrupa autores por livro (pode haver múltiplos autores)
    const livrosMap = new Map<
      number,
      { slug: string | null; titulo: string; imagemUrl: string | null; autores: string[] }
    >()
    for (const row of rows) {
      if (!livrosMap.has(row.codl)) {
        livrosMap.set(row.codl, {
          slug: row.slug,
          titulo: row.titulo,
          imagemUrl: row.imagemUrl,
          autores: [],
        })
      }
      if (row.autorNome) livrosMap.get(row.codl)!.autores.push(row.autorNome)
    }

    const livrosDoAssunto = Array.from(livrosMap.values()).map(({ autores: a, ...livro }) => ({
      ...livro,
      autor: a.join(', ') || null,
    }))

    return reply.send({ ...assunto, livros: livrosDoAssunto })
  })
}
