import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

/** Stacks on phones, sits side by side from sm up. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="break-words text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>}
    </div>
  )
}
