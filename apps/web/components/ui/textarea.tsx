import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-cream-700 font-body placeholder:font-display focus-visible:border-cream-600 focus-visible:ring-3 focus-visible:ring-cream-700/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 w-full min-w-0 rounded-[16px] border bg-white px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-[14px] placeholder:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
