import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
  secondary: 'border border-border bg-surface-secondary text-fg-secondary hover:bg-surface hover:text-fg',
  danger: 'bg-danger text-white hover:bg-danger/90',
  ghost: 'text-fg-secondary hover:bg-surface-secondary hover:text-fg',
}

// md and lg keep a 44px+ touch target.
const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 text-base',
}

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}
