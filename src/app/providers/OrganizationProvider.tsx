import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { organizationKeys } from '@/features/organization/api/organizationKeys'
import type { Organization } from '@/features/organization/types/organization.types'
import { organizationFromUser, organizationOwnerKey } from '@/features/organization/utils/organization'
import { organizationStorage } from '@/features/organization/utils/organizationStorage'
import { useAuth } from '@/hooks/useAuth'
import { OrganizationContext, type OrganizationContextValue } from './organizationContext'

/** Query roots that are not tenant data and must survive an organization change. */
const KEEP_ROOTS = new Set<unknown>(['auth', organizationKeys.all[0]])

/** Server data (/auth/me) wins over the locally remembered organization; the local copy only fills gaps. */
function mergeOrganization(
  fromUser: Organization | null | undefined,
  cached: Organization | null | undefined,
): Organization | null {
  if (!fromUser) return cached ?? null
  if (!fromUser.id) return cached ?? fromUser
  if (cached && cached.id === fromUser.id) {
    const defined = Object.fromEntries(Object.entries(fromUser).filter(([, value]) => value !== undefined))
    return { ...cached, ...defined } as Organization
  }
  return fromUser ?? null
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = organizationOwnerKey(user)

  // Local read, not a network call: the backend has no "get organization" endpoint.
  const { data: cached } = useQuery<Organization | null>({
    queryKey: organizationKeys.current(userId),
    queryFn: () => (userId ? organizationStorage.get(userId) : null),
    initialData: () => (userId ? organizationStorage.get(userId) : null),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const organization = useMemo(() => mergeOrganization(organizationFromUser(user), cached), [user, cached])
  const organizationId = organization?.id

  const setOrganization = useCallback(
    (next: Organization) => {
      if (userId) organizationStorage.set(userId, next)
      queryClient.setQueryData(organizationKeys.current(userId), next)
    },
    [queryClient, userId],
  )

  const setOrganizationId = useCallback(
    (id: string) => {
      const next: Organization = { id, name: organization?.name || 'Workspace' }
      if (userId) organizationStorage.set(userId, next)
      queryClient.setQueryData(organizationKeys.current(userId), next)
    },
    [organization?.name, queryClient, userId],
  )

  const clearOrganization = useCallback(() => {
    if (userId) {
      organizationStorage.clear(userId)
    }
    queryClient.setQueryData(organizationKeys.current(userId), null)
  }, [queryClient, userId])

  // Tenant isolation: when the active organization changes, refetch everything that depends on it.
  const previousId = useRef(organizationId)
  useEffect(() => {
    if (previousId.current === organizationId) return
    previousId.current = organizationId
    void queryClient.invalidateQueries({ predicate: (query) => !KEEP_ROOTS.has(query.queryKey[0]) })
  }, [organizationId, queryClient])

  const value = useMemo<OrganizationContextValue>(
    () => ({
      organization,
      organizationId,
      organizationName: organization?.name,
      organizationLogo: organization?.logo,
      hasOrganization: !!organizationId,
      setOrganization,
      setOrganizationId,
      clearOrganization,
    }),
    [organization, organizationId, setOrganization, setOrganizationId, clearOrganization],
  )

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}