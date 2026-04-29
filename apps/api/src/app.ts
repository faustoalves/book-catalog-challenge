import Fastify from 'fastify'
import { corsPlugin } from './plugins/cors.js'
import { booksRoutes } from './routes/books.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(corsPlugin)
  app.register(booksRoutes, { prefix: '/api' })
  app.get('/api/health', async () => ({ status: 'ok' }))

  return app
}
