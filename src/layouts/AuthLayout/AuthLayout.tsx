import { Layers } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Layers aria-hidden="true" className="h-6 w-6 text-white" />
        </span>
        <span className="text-xl font-extrabold">SaaS Workspace</span>
      </div>
      <Card className="w-full max-w-md">
        <Outlet />
      </Card>
    </div>
  )
}
