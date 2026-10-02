import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`

  return (
    <div>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3 py-1.5 text-sm text-fg-secondary">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-border accent-primary-hover"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
