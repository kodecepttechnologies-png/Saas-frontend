import { useQuery } from '@tanstack/react-query'
import { permissionApi } from '../api/permissionApi'
import { permissionKeys } from '../api/permissionKeys'
import { mockPermissions } from '../mock/mockPermissions'

export function usePermissions(organizationId?: string) {
  return useQuery({
    queryKey: organizationId ? permissionKeys.list() : [...permissionKeys.all, 'preview'],
    queryFn: () => organizationId ? permissionApi.getPermissions() : Promise.resolve(mockPermissions),
    staleTime: 60_000,
  })
}
