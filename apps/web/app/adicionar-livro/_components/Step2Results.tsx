'use client'

import { useEffect } from 'react'
import { useAddBook, type BookSuggestion } from '@/context/AddBookContext'
import { fetcher } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import BookCover from '@/components/ui/books/book-cover/BookCover'

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
        const data = await fetcher<{ items: BookSuggestion[] }>(
          `/api/google-books/search?${params}`,
        )
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
      <div className="flex flex-col gap-6 py-12">
        <Button variant="outline" color="cream" icon={ChevronLeftIcon} onClick={() => setStep(1)}>
          Refazer pesquisa
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {searchResults.map((book) => (
          <BookResultCard key={book.googleId} book={book} onSelect={selectBook} />
        ))}
      </div>

      <Button
        variant="outline"
        color="cream"
        icon={ChevronLeftIcon}
        onClick={() => setStep(1)}
        className="w-full lg:mx-auto lg:w-fit"
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
    <div className="flex basis-1/2 flex-col items-center justify-center pb-12 lg:basis-1/4">
      <div className="group flex h-[340px] min-h-[340px] w-full flex-col items-center justify-center gap-4 lg:h-[360px] lg:min-h-[360px]">
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <BookCover
            imageUrl={
              book.imagemUrl ??
              'https://books.google.com/books/content?id=hzTjygEACAAJ&printsec=frontcover&img=1&zoom=3&source=gbs_api'
            }
            alt={book.titulo}
            size="small"
          />
        </div>
        <div className="flex h-[150px] w-full flex-col items-center justify-center gap-2">
          <p className="title-20 font-playfair line-clamp-3 text-balance px-2 text-center font-semibold text-green-700 group-hover:underline lg:line-clamp-1">
            {book.titulo}
          </p>
          <p className="body-16 line-clamp-1 text-center text-gray-700">
            {book.autores.join(', ')}
          </p>
          <Button
            variant="solid"
            color="green"
            icon={ChevronRightIcon}
            onClick={() => onSelect(book)}
            className="w-auto"
          >
            Selecionar
          </Button>
        </div>
      </div>
    </div>
  )
}
