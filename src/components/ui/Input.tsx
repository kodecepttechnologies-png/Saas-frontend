import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  /** Rendered inside the right edge of the field (e.g. a show/hide button). */
  endAdornment?: ReactNode
}

/** forwardRef so it works with React Hook Form's `register`. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, endAdornment, id, className, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-fg-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          // text-base on phones avoids iOS zoom-on-focus; shrinks from sm up.
          className={cn(
            'min-h-11 w-full rounded-lg border bg-surface-secondary px-3.5 text-base text-fg sm:text-sm',
            'placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-60',
            error ? 'border-danger' : 'border-border hover:border-primary-hover/60',
            endAdornment && 'pr-12',
            className,
          )}
          {...props}
        />
        {endAdornment && <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
