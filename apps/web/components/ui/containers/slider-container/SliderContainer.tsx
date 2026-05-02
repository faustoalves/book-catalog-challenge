import { cn } from '@/lib/utils'
import React from 'react'

type SliderContainerProps = {
  children: React.ReactNode
  className?: string
}

const SliderContainer: React.FC<SliderContainerProps> = ({ children, className }) => {
  return (
    <section
      className={cn('w-full', 'odd:bg-cream-100 even:bg-cream-200', 'lg:px-auto', className)}
    >
      <div className="container mx-auto max-w-[1280px] px-4 py-8">{children}</div>
    </section>
  )
}

export default SliderContainer
