import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
  /** Screen-reader text. Pass an empty string when the spinner is decorative. */
  label?: string
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role={label ? 'status' : undefined} className="inline-flex">
      <Loader2 aria-hidden="true" className={cn('h-5 w-5 animate-spin', className)} />
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}
