import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AppError } from '@/services/errorHandler'
import { roleApi } from '../api/roleApi'
import { roleKeys } from '../api/roleKeys'
import type { CreateRolePayload } from '../types/role.types'

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      try {
        return await roleApi.createRole(payload)
      } catch (error) {
        if (
          error instanceof AppError &&
          (error.status === 409 || /already exists|duplicate|unique/i.test(error.message))
        ) {
          throw new AppError('A role with this name already exists in this organization.', {
            status: error.status,
            details: error.details,
          })
        }
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}
