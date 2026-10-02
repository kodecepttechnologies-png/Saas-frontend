import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullPageError, FullPageSpinner } from '@/components/feedback/FullPageState'
import { useAuth } from '@/hooks/useAuth'
import { useOrganization } from '@/hooks/useOrganization'

export function ProtectedRoute() {
  const { status, errorMessage, retryUser } = useAuth()
  const { hasOrganization } = useOrganization()
  const location = useLocation()

  if (status === 'loading') return <FullPageSpinner label="Loading your account" />
  if (status === 'error') {
    return <FullPageError message={errorMessage ?? 'Please check your connection and try again.'} onRetry={retryUser} />
  }
  if (status === 'unauthenticated') return <Navigate to="/login" replace state={{ from: location }} />

  // If the authenticated user has not set up an organization yet, guide them to organization setup
  if (!hasOrganization && location.pathname !== '/organization/setup') {
    return <Navigate to="/organization/setup" replace />
  }

  return <Outlet />
}
