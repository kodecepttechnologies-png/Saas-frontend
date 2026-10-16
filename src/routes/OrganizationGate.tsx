import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useOrganization } from '@/hooks/useOrganization'

export interface OrganizationGateProps {
  children: ReactNode
}

/**
 * Route guard component that requires an active organization workspace.
 * Redirects to /organization/setup if setup has not been completed.
 */
export function OrganizationGate({ children }: OrganizationGateProps) {
  const { hasOrganization } = useOrganization()

  if (!hasOrganization) {
    return <Navigate to="/organization/setup" replace />
  }

  return <>{children}</>
}
