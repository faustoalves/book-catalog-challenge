'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BookForm } from '@/components/ui/books/book-form/BookForm'
import type { BookFormData } from '@/context/AddBookContext'

export default function EditBookPage() {
  const params = useParams<{ 'slug-do-livro': string }>()
  const slug = params['slug-do-livro']
  const router = useRouter()

  const [initialData, setInitialData] = useState<BookFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livros/${slug}`)
        if (!res.ok) throw new Error('Livro não encontrado')
        const livro = await res.json()
        setInitialData({
          titulo: livro.titulo ?? '',
          autor: livro.autores?.join(', ') ?? '',
          editora: livro.editora ?? '',
          paginas: livro.paginas?.toString() ?? '',
          descricao: livro.descricao ?? '',
          imagemUrl: livro.imagemUrl ?? '',
          categoria: livro.assuntos?.[0]?.nome ?? '',
          valor: livro.valor ?? '',
        })
      } catch {
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBook()
  }, [slug, router])

  async function handleSubmit(data: BookFormData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livros/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: data.titulo,
        editora: data.editora || undefined,
        paginas: data.paginas ? parseInt(data.paginas) : undefined,
        descricao: data.descricao || undefined,
        imagemUrl: data.imagemUrl || undefined,
        valor: data.valor || '0',
      }),
    })

    if (!res.ok) throw new Error('Erro ao atualizar livro')

    const livro = await res.json()
    router.push(`/livro/${livro.slug}`)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <p className="body-16 text-cream-700">Carregando...</p>
      </main>
    )
  }

  if (!initialData) return null

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="title-40 text-cream-900">Editar livro</h1>
          <p className="body-18 text-cream-800 mt-2">
            Ajuste as informações do livro e salve as alterações.
          </p>
        </div>

        <BookForm
          initialData={initialData}
          mode="edit"
          onSubmit={handleSubmit}
          onBack={() => router.back()}
        />
      </div>
    </main>
  )
}
