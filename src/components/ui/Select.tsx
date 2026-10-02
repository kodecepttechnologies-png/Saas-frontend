import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, hint, id, className, ...props },
  ref,
) {
  const autoId = useId()
  const selectId = id ?? autoId
  const errorId = `${selectId}-error`
  const hintId = `${selectId}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className="w-full">
      <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-fg-secondary">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'min-h-11 w-full appearance-none rounded-lg border bg-surface-secondary pl-3.5 pr-10 text-base text-fg sm:text-sm',
            error ? 'border-danger' : 'border-border hover:border-primary-hover/60',
            className,
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
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
