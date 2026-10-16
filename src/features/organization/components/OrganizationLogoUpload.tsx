import { useId } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { buttonStyles } from '@/components/ui'
import { useObjectUrl } from '@/hooks/useObjectUrl'
import { cn } from '@/utils/cn'

interface OrganizationLogoUploadProps {
  value?: File
  onChange: (file: File | undefined) => void
  error?: string
  disabled?: boolean
}

export function OrganizationLogoUpload({ value, onChange, error, disabled }: OrganizationLogoUploadProps) {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const previewUrl = useObjectUrl(value)

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-fg-secondary">Logo (optional)</span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
          {previewUrl ? (
            <img src={previewUrl} alt="Selected logo preview" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus aria-hidden="true" className="h-8 w-8 text-fg-muted" />
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : hintId}
              className="peer sr-only"
              onChange={(e) => {
                onChange(e.target.files?.[0])
                // Lets the same file be picked again after removing it.
                e.target.value = ''
              }}
            />
            <label
              htmlFor={inputId}
              className={cn(
                buttonStyles('secondary', 'md'),
                'cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-primary-hover peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                disabled && 'pointer-events-none opacity-50',
              )}
            >
              {value ? 'Change logo' : 'Upload logo'}
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange(undefined)}
                disabled={disabled}
                className={buttonStyles('ghost', 'md')}
              >
                <X aria-hidden="true" className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>
          <p id={hintId} className="truncate text-sm text-fg-muted">
            {value ? value.name : 'JPG, PNG or WEBP'}
          </p>
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}