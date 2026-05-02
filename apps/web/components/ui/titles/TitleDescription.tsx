import React from 'react'

type TitleDescriptionProps = {
  type?: 'small' | 'medium' | 'large'
  title: string
  description?: string
  className?: string
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({
  type,
  title,
  description,
  className = '',
}) => {
  const containerClasses = type === 'large' ? 'gap-4' : 'gap-0'
  const titleClasses =
    type === 'small'
      ? 'title-28 md:title-32 text-green-700'
      : type === 'medium'
        ? 'title-32 md:title-48 text-green-700'
        : 'title-40 md:title-56 text-brown-500'
  const descriptionClasses =
    type === 'small'
      ? 'body-16 md:body-18'
      : type === 'medium'
        ? 'body-18 md:body-20'
        : 'body-18 md:body-20'
  return (
    <div className={cn('m-0 flex flex-col gap-2 p-0', containerClasses, className)}>
      {type === 'small' ? (
        <h2 className={cn('font-playfair text-balance', titleClasses)}>{title}</h2>
      ) : (
        <h1 className={cn('font-playfair text-balance', titleClasses)}>{title}</h1>
      )}

      {description && (
        <p className={cn('text-balance text-black', descriptionClasses)}>{description}</p>
      )}
    </div>
  )
}

export default TitleDescription
