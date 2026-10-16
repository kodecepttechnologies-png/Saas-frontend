import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/features/auth/api/authKeys'
import { useAuth } from '@/hooks/useAuth'
import { useOrganization } from '@/hooks/useOrganization'
import type { AppError } from '@/services/errorHandler'
import { organizationApi } from '../api/organizationApi'
import { organizationKeys } from '../api/organizationKeys'
import { organizationOwnerKey } from '../utils/organization'
import type {
  Organization,
  OrganizationRegistrationPayload,
} from '../types/organization.types'

export function useRegisterOrganization() {
  const queryClient = useQueryClient()

  const { user } = useAuth()
  const { setOrganization } = useOrganization()

  const userId = organizationOwnerKey(user)

  return useMutation<
    Organization,
    AppError,
    OrganizationRegistrationPayload
  >({
    mutationFn: (payload) =>
      organizationApi.register(payload),

    onSuccess: (organization) => {
      if (!organization) {
        return
      }

      /*
       * Save organization to:
       *
       * 1. OrganizationProvider
       * 2. localStorage
       * 3. React Query cache
       */
      setOrganization(
        organization,
      )

      queryClient.setQueryData(
        organizationKeys.current(userId),
        organization,
      )

      // Refresh server-backed state in the background; it must not delay navigation.
      void queryClient.invalidateQueries({
        queryKey: authKeys.me,
      })
    },
  })
}