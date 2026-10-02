import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface OrganizationLogoUploadProps {
  value?: File | undefined
  onChange: (file: File | undefined) => void
  error?: string
  disabled?: boolean
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function OrganizationLogoUpload({
  value,
  onChange,
  error,
  disabled = false,
  className,
}: OrganizationLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Maintain object URL for preview and revoke on cleanup
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(value)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [value])

  const handleFile = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      return
    }
    onChange(file)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (disabled) return
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const handleRemove = () => {
    onChange(undefined)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <label className="mb-1.5 block text-sm font-medium text-fg-secondary">
        Organization Logo <span className="text-fg-muted font-normal">(Optional)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="sr-only"
        id="organization-logo-input"
        aria-invalid={error ? true : undefined}
      />

      {previewUrl && value ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface-secondary p-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface p-1">
              <img
                src={previewUrl}
                alt="Logo preview"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg" title={value.name}>
                {value.name}
              </p>
              <p className="text-xs text-fg-muted">{formatFileSize(value.size)}</p>
              <span className="inline-block mt-1 text-xs text-success font-medium">Ready to upload</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-fg-secondary hover:bg-surface-secondary hover:text-fg disabled:opacity-50"
            >
              <ImagePlus aria-hidden="true" className="h-4 w-4" />
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 text-xs font-semibold text-danger hover:bg-danger/20 disabled:opacity-50"
              aria-label="Remove selected logo"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="Upload organization logo"
          className={cn(
            'group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/10'
              : error
                ? 'border-danger bg-danger/5'
                : 'border-border bg-surface-secondary/40 hover:border-primary-hover/70 hover:bg-surface-secondary/80',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border group-hover:border-primary-hover/50 group-hover:scale-105 transition-transform mb-3">
            <UploadCloud aria-hidden="true" className="h-6 w-6 text-primary-hover" />
          </div>
          <p className="text-sm font-semibold text-fg">
            <span className="text-primary-hover group-hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-fg-muted">SVG, PNG, JPG or WebP (recommended square, max 5MB)</p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
