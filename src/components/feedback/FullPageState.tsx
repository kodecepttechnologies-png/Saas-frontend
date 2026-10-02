import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

export function FullPageSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <Spinner label={label} className="h-8 w-8 text-primary-hover" />
    </div>
  )
}

export function FullPageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-xl font-bold">We couldn't load your account</h1>
      <p className="max-w-sm text-fg-muted">{message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </main>
  )
}
