'use client'

import { useEffect } from 'react'
import { useAddBook, type BookSuggestion } from '@/context/AddBookContext'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export function Step2Results() {
  const {
    searchTitulo,
    searchAutor,
    searchResults,
    isSearching,
    setSearchResults,
    setIsSearching,
    selectBook,
    setStep,
  } = useAddBook()

  useEffect(() => {
    async function search() {
      setIsSearching(true)
      try {
        const params = new URLSearchParams()
        if (searchTitulo) params.set('q', searchTitulo)
        if (searchAutor) params.set('autor', searchAutor)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/google-books/search?${params}`,
        )
        const data = await res.json()
        setSearchResults(data.items ?? [])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }
    search()
  }, [searchTitulo, searchAutor]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isSearching) {
    return <p className="body-16 text-cream-700">Buscando livros...</p>
  }

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <p className="body-16">
          Não encontramos livros com esse título ou autor. Tente verificar a ortografia ou buscar
          com termos diferentes.
        </p>
        <Button variant="outline" color="cream" icon={ChevronLeftIcon} onClick={() => setStep(1)}>
          Refazer pesquisa
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((book) => (
          <BookResultCard key={book.googleId} book={book} onSelect={selectBook} />
        ))}
      </div>

      <Button
        variant="outline"
        color="cream"
        icon={ChevronLeftIcon}
        onClick={() => setStep(1)}
        className="self-start"
      >
        Refazer pesquisa
      </Button>
    </div>
  )
}

function BookResultCard({
  book,
  onSelect,
}: {
  book: BookSuggestion
  onSelect: (book: BookSuggestion) => void
}) {
  return (
    <div className="border-cream-300 flex gap-3 rounded-[16px] border bg-white p-3">
      {book.imagemUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.imagemUrl}
          alt={book.titulo}
          className="h-24 w-16 flex-shrink-0 rounded object-cover"
        />
      )}
      <div className="flex min-w-0 flex-col justify-between gap-2">
        <div>
          <p className="body-14 text-cream-900 line-clamp-2 font-semibold">{book.titulo}</p>
          <p className="body-14 text-cream-700">{book.autores.join(', ')}</p>
          {book.editora && <p className="body-14 text-cream-600">{book.editora}</p>}
        </div>
        <Button
          variant="solid"
          color="green"
          icon={ChevronRightIcon}
          onClick={() => onSelect(book)}
          className="self-start"
        >
          Selecionar
        </Button>
      </div>
    </div>
  )
}
