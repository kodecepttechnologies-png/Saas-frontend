import { Navigate, Outlet } from 'react-router-dom'
import { FullPageSpinner } from '@/components/feedback/FullPageState'
import { useAuth } from '@/hooks/useAuth'

/** Sign-in-style pages: signed-in users are sent to the app instead. */
export function PublicRoute() {
  const { status } = useAuth()
  if (status === 'loading') return <FullPageSpinner />
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
