import cors from '@fastify/cors'
import fp from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://book-catalog.faustoalves.com.br',
  'https://www.book-catalog.faustoalves.com.br',
]

export const corsPlugin = fp(async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: ALLOWED_ORIGINS,
  })
})
