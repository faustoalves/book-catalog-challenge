import cors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  })
}
