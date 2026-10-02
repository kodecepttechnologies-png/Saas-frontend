import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

type Tone = 'error' | 'success' | 'info'

const styles: Record<Tone, { box: string; Icon: typeof Info }> = {
  error: { box: 'border-danger/40 bg-danger/10 text-fg', Icon: AlertCircle },
  success: { box: 'border-success/40 bg-success/10 text-fg', Icon: CheckCircle2 },
  info: { box: 'border-primary-hover/40 bg-primary/15 text-fg', Icon: Info },
}

export function Alert({ tone = 'info', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const { box, Icon } = styles[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-lg border p-3 text-sm', box, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  )
}
