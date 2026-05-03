import { cn } from '@/lib/utils'
import React from 'react'

type SliderContainerProps = {
  children: React.ReactNode
  className?: string
}

const SliderContainer: React.FC<SliderContainerProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        'border-cream-300 w-full border-t',
        'odd:bg-cream-200 even:bg-cream-100',
        'lg:px-auto',
        className,
      )}
    >
      <div className="container mx-auto max-w-[1280px] py-8">{children}</div>
    </section>
  )
}

export default SliderContainer
