import { cn } from '@/lib/utils'
import React from 'react'

type HeaderContainerProps = {
  children: React.ReactNode
  className?: string
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children, className }) => {
  return (
    <section
      className={cn(
        'w-full bg-[radial-gradient(100%_100%_at_99.03%_0%,var(--color-cream-400)_0%,var(--color-cream-100)_100%)] px-4 pb-0 pt-[104px] md:px-6 md:pb-20 md:pt-[136px] lg:pb-20 lg:pt-[172px]',
        'lg:px-auto',
        className,
      )}
    >
      <div className="container mx-auto max-w-[1280px]">{children}</div>
    </section>
  )
}

export default HeaderContainer
