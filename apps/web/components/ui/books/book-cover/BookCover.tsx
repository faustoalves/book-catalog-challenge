import React from 'react'

type BookCoverProps = {
  imageUrl: string
  alt?: string
  className?: string
  size?: 'small' | 'large'
}

const sizeMap = {
  small:
    'max-h-[205px] max-w-[150px] md:max-w-[200px] md:max-h-[238px] xl:max-w-[240px] xl:max-h-[240px]',
  large: 'max-h-[320px] min-h-[200px] w-auto',
}

const BookCover: React.FC<BookCoverProps> = ({
  imageUrl,
  alt = 'Capa do livro',
  className = '',
  size = 'small',
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        className={`block h-auto w-auto object-cover ${sizeMap[size]}`}
        loading="lazy"
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/over_book_layer.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/right_book_shadow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-0 h-full"
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bottom_book_shadow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-full w-full"
      />
    </div>
  )
}

export default BookCover
