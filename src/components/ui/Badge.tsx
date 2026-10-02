import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-secondary text-fg-secondary border-border',
  primary: 'bg-primary/20 text-fg border-primary-hover/50',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-danger/15 text-danger border-danger/30',
}

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}
      {...props}
    />
  )
}
