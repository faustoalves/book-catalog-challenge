import { asc, count, desc, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { db } from '../db/index.js'
import { assuntos, autores, livroAssunto, livroAutor, livros } from '../db/schema.js'

export async function homeRoutes(app: FastifyInstance) {
  app.get('/home', async (_request, reply) => {
    const [allAssuntos, rows, counts] = await Promise.all([
      db
        .select({
          codAs: assuntos.codAs,
          nome: assuntos.nome,
          slug: assuntos.slug,
          descricao: assuntos.descricao,
        })
        .from(assuntos)
        .orderBy(asc(assuntos.nome)),

      db
        .select({
          assuntoCodAs: livroAssunto.assuntoCodAs,
          codl: livros.codl,
          titulo: livros.titulo,
          slug: livros.slug,
          imagemUrl: livros.imagemUrl,
          autorNome: autores.nome,
        })
        .from(livroAssunto)
        .innerJoin(livros, eq(livros.codl, livroAssunto.livroCodl))
        .leftJoin(livroAutor, eq(livroAutor.livroCodl, livros.codl))
        .leftJoin(autores, eq(autores.codAu, livroAutor.autorCodAu))
        .orderBy(desc(livros.codl)),

      db
        .select({
          assuntoCodAs: livroAssunto.assuntoCodAs,
          total: count(livroAssunto.livroCodl),
        })
        .from(livroAssunto)
        .groupBy(livroAssunto.assuntoCodAs),
    ])

    const countByAssunto = new Map(counts.map((c) => [c.assuntoCodAs, Number(c.total)]))

    // Agrupa autores por (assuntoCodAs, codl), mantendo ordem de inserção
    type LivroEntry = {
      codl: number
      slug: string | null
      titulo: string
      imagemUrl: string | null
      autores: string[]
    }
    const livrosByAssunto = new Map<number, Map<number, LivroEntry>>()

    for (const row of rows) {
      if (!livrosByAssunto.has(row.assuntoCodAs)) {
        livrosByAssunto.set(row.assuntoCodAs, new Map())
      }
      const livrosMap = livrosByAssunto.get(row.assuntoCodAs)!

      if (!livrosMap.has(row.codl)) {
        if (livrosMap.size >= 10) continue
        livrosMap.set(row.codl, {
          codl: row.codl,
          slug: row.slug,
          titulo: row.titulo,
          imagemUrl: row.imagemUrl,
          autores: [],
        })
      }
      if (row.autorNome) livrosMap.get(row.codl)!.autores.push(row.autorNome)
    }

    const result = allAssuntos.map(({ codAs, ...assunto }) => ({
      ...assunto,
      count: countByAssunto.get(codAs) ?? 0,
      livros: Array.from(livrosByAssunto.get(codAs)?.values() ?? []).map(
        ({ codl: _, autores: a, ...livro }) => ({
          ...livro,
          autor: a.join(', ') || null,
        }),
      ),
    }))

    return reply.send(result)
  })
}
