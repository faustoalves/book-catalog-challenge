import { BookApi } from '@book-catalog/shared'
import React from 'react'
import BookCover from '../book-cover/BookCover'

const BookItem = (book: BookApi) => {
  return (
    <div className="flex basis-1/2 items-center justify-center lg:basis-1/4">
      <div className="group flex h-[320px] min-h-[320px] w-full flex-col items-center justify-center gap-4 lg:h-[360px] lg:min-h-[360px]">
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
        <div className="flex h-[104px] flex-col gap-2">
          <p className="title-20 font-playfair line-clamp-2 px-2 text-center font-semibold text-balance text-green-700 group-hover:underline">
            {book.titulo}
          </p>
          <p className="body-16 line-clamp-1 text-center text-gray-700">{book.autor}</p>
        </div>
      </div>
    </div>
  )
}

export default BookItem
