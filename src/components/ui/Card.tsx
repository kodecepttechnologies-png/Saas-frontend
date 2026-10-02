import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** dark: default surface on the black background. light: white surface for forms/tables. */
  tone?: 'dark' | 'light'
}

export function Card({ tone = 'dark', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 sm:p-6',
        tone === 'dark' ? 'border border-border bg-surface text-fg' : 'bg-white text-neutral-900',
        className,
      )}
      {...props}
    />
  )
}
