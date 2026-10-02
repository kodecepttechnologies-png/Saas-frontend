import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { organizationFromUser } from '@/features/organization/utils/organization'
import { organizationStorage } from '@/features/organization/utils/organizationStorage'
import type { Organization } from '@/features/organization/types/organization.types'
import { useAuth } from '@/hooks/useAuth'
import { OrganizationContext, type OrganizationContextValue } from './organizationContext'

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth()
  const [storedOrg, setStoredOrg] = useState<Organization | null>(() => organizationStorage.get())

  // Source of truth: what the backend reports for the authenticated user (/auth/me)
  const userOrg = useMemo(() => organizationFromUser(user), [user])

  // Merge server org with stored org (server overrides, but local fields fill in if server only gave ID)
  const activeOrg = useMemo<Organization | null>(() => {
    if (userOrg && userOrg.id) {
      if (storedOrg && storedOrg.id === userOrg.id) {
        return {
          ...storedOrg,
          ...userOrg,
          name: userOrg.name && userOrg.name !== 'Workspace' ? userOrg.name : (storedOrg.name || 'Workspace'),
          logo: userOrg.logo || storedOrg.logo,
        }
      }
      return userOrg
    }
    return storedOrg
  }, [userOrg, storedOrg])

  // Tenant isolation & security: clear organization identity when unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      organizationStorage.clear()
      setStoredOrg(null)
    }
  }, [status])

  const setOrganization = useCallback((org: Organization) => {
    organizationStorage.set(org)
    setStoredOrg(org)
  }, [])

  const setOrganizationId = useCallback((id: string) => {
    organizationStorage.set(id)
    setStoredOrg((prev) => (prev ? { ...prev, id } : { id, name: 'Workspace' }))
  }, [])

  const clearOrganization = useCallback(() => {
    organizationStorage.clear()
    setStoredOrg(null)
  }, [])

  const organizationId = activeOrg?.id || undefined
  const organizationName = activeOrg?.name || undefined
  const organizationLogo = activeOrg?.logo || undefined
  const hasOrganization = !!organizationId && organizationId.trim().length > 0

  const value = useMemo<OrganizationContextValue>(
    () => ({
      organization: activeOrg,
      organizationId,
      organizationName,
      organizationLogo,
      hasOrganization,
      setOrganization,
      setOrganizationId,
      clearOrganization,
    }),
    [
      activeOrg,
      organizationId,
      organizationName,
      organizationLogo,
      hasOrganization,
      setOrganization,
      setOrganizationId,
      clearOrganization,
    ],
  )

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}
