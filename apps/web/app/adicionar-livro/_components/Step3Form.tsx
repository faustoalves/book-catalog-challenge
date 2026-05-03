'use client'

import { useRouter } from 'next/navigation'
import { useAddBook } from '@/context/AddBookContext'
import { BookForm } from '@/components/ui/books/book-form/BookForm'
import type { BookFormData } from '@/context/AddBookContext'

export function Step3Form() {
  const { formData, setStep, reset } = useAddBook()
  const router = useRouter()

  async function handleSubmit(data: BookFormData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: data.titulo,
        autores: data.autor ? data.autor.split(',').map((a) => a.trim()) : [],
        editora: data.editora || undefined,
        paginas: data.paginas ? parseInt(data.paginas) : undefined,
        descricao: data.descricao || undefined,
        imagemUrl: data.imagemUrl || undefined,
        valor: data.valor || '0',
        assuntos: [],
      }),
    })

    if (!res.ok) throw new Error('Erro ao adicionar livro')

    const livro = await res.json()
    reset()
    router.push(`/livro/${livro.slug}`)
  }

  return (
    <BookForm initialData={formData} mode="add" onSubmit={handleSubmit} onBack={() => setStep(1)} />
  )
}
