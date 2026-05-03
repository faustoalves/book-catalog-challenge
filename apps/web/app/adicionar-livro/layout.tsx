import { AddBookProvider } from '@/context/AddBookContext'
import type { ReactNode } from 'react'

export default function AddBookLayout({ children }: { children: ReactNode }) {
  return <AddBookProvider>{children}</AddBookProvider>
}
