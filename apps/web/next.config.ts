import type { NextConfig } from 'next'
import path from 'path'

const config: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../..'),
    resolveAlias: {
      '@': path.resolve(__dirname),
    },
  },
  images: {
    remotePatterns: [{ hostname: 'covers.openlibrary.org' }, { hostname: 'books.google.com' }],
  },
}

export default config
