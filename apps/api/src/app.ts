import Fastify from 'fastify'
import { corsPlugin } from './plugins/cors.js'
import { googleBooksRoutes } from './routes/google-books.js'
import { livrosRoutes } from './routes/livros.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(corsPlugin)
  app.register(livrosRoutes, { prefix: '/api' })
  app.register(googleBooksRoutes, { prefix: '/api' })
  app.get('/api/health', async () => ({ status: 'ok' }))

  return app
}
