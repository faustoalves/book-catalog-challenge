import cors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://book-catalog.faustoalves.com.br',
  'https://www.book-catalog.faustoalves.com.br',
]

export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'), false)
      }
    },
  })
}
