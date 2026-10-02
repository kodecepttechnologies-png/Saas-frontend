import { forwardRef, useId, type InputHTMLAttributes } from 'react'

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { label, error, hint, id, ...props },
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
      <input
        ref={ref}
        id={inputId}
        type="file"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="block w-full rounded-lg border border-border bg-surface-secondary text-sm text-fg-secondary file:mr-3 file:min-h-11 file:cursor-pointer file:border-0 file:bg-primary file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-hover"
        {...props}
      />
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
