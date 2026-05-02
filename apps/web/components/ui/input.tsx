import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'border-cream-700 focus-visible:border-cream-600 focus-visible:ring-3 focus-visible:ring-cream-700/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 w-full min-w-0 rounded-[16px] border bg-white px-4 py-3 font-[family-name:var(--font-body)] text-[14px] outline-none transition-colors placeholder:font-[family-name:var(--font-display)] placeholder:text-[14px] placeholder:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
