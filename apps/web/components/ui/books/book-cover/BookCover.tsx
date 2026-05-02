import React from 'react'

type BookCoverProps = {
  imageUrl: string
  alt?: string
  className?: string
  size?: 'small' | 'large'
}

const BookCover: React.FC<BookCoverProps> = ({
  imageUrl,
  alt = 'Capa do livro',
  className = '',
  size = 'small',
}) => {
  const sizeClasses =
    size === 'small'
      ? 'max-h-[205px] max-w-[150px] md:max-w-[200px] md:max-h-[238px] xl:max-w-[240px] xl:max-h-[240px]'
      : 'max-h-[320px] min-h-[200px] w-auto'
  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="block h-auto max-h-[240px] min-h-[120px] w-auto object-cover"
        loading="lazy"
      />

      {/* Overlay — mesmo tamanho da imageUrl via inset-0 w-full h-full */}
      <img
        src="/over_book_layer.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* Sombra lateral direita */}
      <img
        src="/right_book_shadow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-0 h-full"
      />

      {/* Sombra inferior */}
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
