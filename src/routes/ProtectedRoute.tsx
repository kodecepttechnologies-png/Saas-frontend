import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  FullPageError,
  FullPageSpinner,
} from '@/components/feedback/FullPageState'
import { useAuth } from '@/hooks/useAuth'
import { useOrganization } from '@/hooks/useOrganization'

export function ProtectedRoute() {
  const { status, errorMessage, retryUser } = useAuth()
  const {
    hasOrganization,
    organization,
  } = useOrganization()

  const location = useLocation()

  /*
   * Authentication is still being restored.
   *
   * Do not make any organization decision yet.
   */
  if (status === 'loading') {
    return <FullPageSpinner label="Loading your account" />
  }

  /*
   * Authentication failed.
   */
  if (status === 'error') {
    return (
      <FullPageError
        message={
          errorMessage ??
          'Please check your connection and try again.'
        }
        onRetry={retryUser}
      />
    )
  }

  /*
   * No valid session.
   */
  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  /*
   * At this point the user is authenticated.
   *
   * If an organization exists, allow the user to access
   * the application normally.
   */
  if (hasOrganization && organization) {
    return <Outlet />
  }

  /*
   * No organization exists.
   *
   * Only redirect to setup when the user is trying to access
   * another protected application page.
   */
  if (
    !hasOrganization &&
    location.pathname !== '/organization/setup' &&
    !location.pathname.startsWith('/roles') &&
    location.pathname !== '/create-role'
  ) {
    return (
      <Navigate
        to="/organization/setup"
        replace
      />
    )
  }

  /*
   * User is authenticated and currently on organization setup.
   */
  return <Outlet />
}