import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Book Catalog',
  description: 'Catalog and discover books',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
