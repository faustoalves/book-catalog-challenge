import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'covers.openlibrary.org' }, { hostname: 'books.google.com' }],
  },
}

export default config
