import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/features/auth/api/authKeys'
import { useOrganization } from '@/hooks/useOrganization'
import type { AppError } from '@/services/errorHandler'
import { organizationApi } from '../api/organizationApi'
import { organizationKeys } from '../api/organizationKeys'
import type {
  OrganizationRegistrationPayload,
  RegisterOrganizationResponse,
} from '../types/organization.types'

export function useRegisterOrganization() {
  const queryClient = useQueryClient()
  const { setOrganization } = useOrganization()

  return useMutation<RegisterOrganizationResponse, AppError, OrganizationRegistrationPayload>({
    mutationFn: (payload) => organizationApi.register(payload),
    onSuccess: (data) => {
      if (data.organization) {
        setOrganization(data.organization)
        queryClient.setQueryData(organizationKeys.current(), data.organization)
      } else if (data.organizationId) {
        setOrganization({
          id: data.organizationId,
          name: 'Workspace',
        })
      }

      // Invalidate current user query to reflect newly associated organization
      void queryClient.invalidateQueries({ queryKey: authKeys.me })

      // Invalidate organization queries
      void queryClient.invalidateQueries({ queryKey: organizationKeys.all })

      // Tenant boundary: invalidate workforce queries that depend on organization context
      void queryClient.invalidateQueries({ queryKey: ['departments'] })
      void queryClient.invalidateQueries({ queryKey: ['designations'] })
      void queryClient.invalidateQueries({ queryKey: ['roles'] })
      void queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
