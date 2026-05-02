import * as React from 'react'
import { Input as InputPrimitive } from '@base-ui/react/input'

import { cn } from '@/lib/utils'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      className={cn('group relative flex items-center', className)}
      {...props}
    />
  )
}

function InputGroupPrefix({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group-prefix"
      className={cn(
        'text-muted-foreground pointer-events-none absolute left-4 flex items-center',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupSuffix({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group-suffix"
      className={cn(
        'text-muted-foreground pointer-events-none absolute right-4 flex items-center',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input-group-input"
      className={cn(
        'border-cream-700 font-body placeholder:font-display focus-visible:border-cream-600 focus-visible:ring-3 focus-visible:ring-cream-700/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 w-full min-w-0 rounded-[16px] border bg-white px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-[14px] placeholder:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'group-has-[[data-slot=input-group-prefix]]:pl-10',
        'group-has-[[data-slot=input-group-suffix]]:pr-10',
        className,
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupPrefix, InputGroupSuffix, InputGroupInput }
