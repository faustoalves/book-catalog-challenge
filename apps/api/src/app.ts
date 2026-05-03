import Fastify from 'fastify'
import { corsPlugin } from './plugins/cors.js'
import { assuntosRoutes } from './routes/assuntos.js'
import { googleBooksRoutes } from './routes/google-books.js'
import { homeRoutes } from './routes/home.js'
import { livrosRoutes } from './routes/livros.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(corsPlugin)
  app.register(livrosRoutes, { prefix: '/api' })
  app.register(assuntosRoutes, { prefix: '/api' })
  app.register(googleBooksRoutes, { prefix: '/api' })
  app.register(homeRoutes, { prefix: '/api' })
  app.get('/api/health', async () => ({ status: 'ok' }))

  return app
}
