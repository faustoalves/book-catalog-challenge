'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCarousel } from '@/components/ui/carousel'

export function BooksSliderNav() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()

  return (
    <div className="hidden flex-row gap-2 lg:flex">
      <Button
        variant="outline"
        color="green"
        icon={ChevronLeftIcon}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      />
      <Button
        variant="outline"
        color="green"
        icon={ChevronRightIcon}
        onClick={scrollNext}
        disabled={!canScrollNext}
      />
    </div>
  )
}
