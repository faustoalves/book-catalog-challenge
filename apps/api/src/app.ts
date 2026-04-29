import type { IncomingMessage, ServerResponse } from 'node:http'
import Fastify from 'fastify'
import { corsPlugin } from './plugins/cors.js'
import { googleBooksRoutes } from './routes/google-books.js'
import { livrosRoutes } from './routes/livros.js'

export const app = Fastify({ logger: true })

app.register(corsPlugin)
app.register(livrosRoutes, { prefix: '/api' })
app.register(googleBooksRoutes, { prefix: '/api' })
app.get('/api/health', async () => ({ status: 'ok' }))

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready()
  app.server.emit('request', req, res)
}
