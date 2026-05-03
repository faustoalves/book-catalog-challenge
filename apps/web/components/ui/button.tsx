import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-[20px] transition-colors outline-none select-none btn-label disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border bg-transparent',
      },
      color: {
        cream: '',
        green: '',
        gray: '',
        brown: '',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        color: 'cream',
        className: 'bg-cream-900 text-white  hover:bg-cream-800 focus-visible:ring-cream-900',
      },
      {
        variant: 'solid',
        color: 'green',
        className: 'bg-green-700 text-white  hover:bg-green-500 focus-visible:ring-green-700',
      },
      {
        variant: 'solid',
        color: 'gray',
        className: 'bg-gray-700  text-white  hover:bg-gray-500  focus-visible:ring-gray-700',
      },
      {
        variant: 'solid',
        color: 'brown',
        className: 'bg-brown-700 text-white  hover:bg-brown-500 focus-visible:ring-brown-700',
      },
      {
        variant: 'outline',
        color: 'cream',
        className:
          'border-cream-900 text-cream-900 hover:border-cream-800 hover:text-cream-800 focus-visible:ring-cream-900',
      },
      {
        variant: 'outline',
        color: 'green',
        className:
          'border-green-700 text-green-700 hover:border-green-500 hover:text-green-500 focus-visible:ring-green-700',
      },
      {
        variant: 'outline',
        color: 'gray',
        className:
          'border-gray-700  text-gray-700  hover:border-gray-500  hover:text-gray-500  focus-visible:ring-gray-700',
      },
      {
        variant: 'outline',
        color: 'brown',
        className:
          'border-brown-700 text-brown-700 hover:border-brown-500 hover:text-brown-500 focus-visible:ring-brown-700',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'cream',
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    icon?: LucideIcon
  }

function Button({ className, variant, color, icon: Icon, children, ...props }: ButtonProps) {
  const hasLabel = !!children
  const paddingClass = hasLabel ? 'px-6 py-3 gap-1.5' : 'p-4'

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn('cursor-pointer', buttonVariants({ variant, color }), paddingClass, className)}
      {...props}
    >
      {Icon && <Icon />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
