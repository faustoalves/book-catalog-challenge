import Link from 'next/link'
import type { BookSlider } from '@book-catalog/shared'
import { ArrowRightIcon } from 'lucide-react'

import TitleDescription from '@/components/ui/titles/TitleDescription'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import SliderContainer from '@/components/ui/containers/slider-container/SliderContainer'
import { BooksSliderNav } from './BooksSliderNav'
import BookItem from '../book-item/BookItem'
import { Button } from '../../button'

const BooksSlider: React.FC<BookSlider> = ({ nome, descricao, livros, count }) => {
  return (
    <SliderContainer className="lg:px-auto px-0">
      <Carousel opts={{ align: 'start' }} className="w-full">
        <div className="mb-6 flex items-start justify-between gap-4 px-4">
          <TitleDescription type="small" title={nome} description={descricao} />

          {livros.length > 4 && <BooksSliderNav />}
        </div>

        <CarouselContent className="-px-4 w-full lg:mx-0">
          {livros.map((book) => (
            <CarouselItem
              key={book.slug}
              className="flex basis-3/5 items-center justify-center lg:basis-1/4"
            >
              <Link href={`/livro/${book.slug}`} className="group flex flex-col gap-2">
                <BookItem {...book} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-center px-4">
        <Button
          variant="outline"
          color="green"
          icon={ArrowRightIcon}
          className="ml-auto w-full lg:w-auto"
        >
          Ver todos - {count}
        </Button>
      </div>
    </SliderContainer>
  )
}

export default BooksSlider
