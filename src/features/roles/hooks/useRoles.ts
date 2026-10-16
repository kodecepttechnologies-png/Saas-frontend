import { useQuery } from '@tanstack/react-query'
import { roleApi } from '../api/roleApi'
import { roleKeys } from '../api/roleKeys'

export function useRoles(
  organizationId?: string,
) {
  return useQuery({
    queryKey: roleKeys.list(organizationId),
    queryFn: () => roleApi.getRoles(),
    staleTime: 30_000,
  })
}

export function useRoleSearch(
  organizationId: string | undefined,
  search: string,
) {
  const hasSearch = Boolean(search.trim())

  return useQuery({
    queryKey: roleKeys.search(organizationId, search),
    queryFn: () => roleApi.searchRoles(search, organizationId),
    enabled: hasSearch,
    staleTime: 15_000,
  })
}