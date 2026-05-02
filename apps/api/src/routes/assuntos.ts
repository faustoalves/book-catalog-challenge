import { asc } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { db } from '../db/index.js'
import { assuntos } from '../db/schema.js'

export async function assuntosRoutes(app: FastifyInstance) {
  app.get('/assuntos', async (_request, reply) => {
    const rows = await db
      .select({ nome: assuntos.nome, slug: assuntos.slug })
      .from(assuntos)
      .orderBy(asc(assuntos.nome))

    return reply.send(rows)
  })
}
