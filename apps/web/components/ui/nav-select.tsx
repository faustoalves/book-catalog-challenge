'use client'

import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import { ChevronDownIcon, CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const NavSelect = SelectPrimitive.Root

function NavSelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="nav-select-trigger"
      className={cn(
        'btn-label inline-flex cursor-pointer select-none items-center justify-between gap-4 rounded-[20px] bg-green-700 px-6 py-3 text-white outline-none transition-colors hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="pointer-events-none shrink-0 text-white" />}
      />
    </SelectPrimitive.Trigger>
  )
}

function NavSelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, 'align' | 'side' | 'sideOffset'>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="nav-select-content"
          className={cn(
            'origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative isolate z-50 min-w-36 overflow-hidden rounded-[20px] bg-green-700 shadow-md duration-100',
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List className="divide-y divide-green-500/30">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function NavSelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="nav-select-item"
      className={cn(
        'btn-label data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-green-500 relative flex w-full cursor-default select-none items-center gap-2 px-6 py-3 text-white outline-none hover:bg-green-500 focus:bg-green-500',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-4 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="size-4 text-white" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function NavSelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="nav-select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  )
}

export { NavSelect, NavSelectTrigger, NavSelectContent, NavSelectItem, NavSelectValue }
