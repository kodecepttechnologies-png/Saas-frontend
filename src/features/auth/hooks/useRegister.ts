import { useMutation } from '@tanstack/react-query'
import type { AppError } from '@/services/errorHandler'
import { authApi } from '../api/authApi'
import type { RegisterFormValues } from '../schemas/auth.schemas'

export function useRegister() {
  return useMutation<void, AppError, RegisterFormValues>({
    // confirmPassword is a UI-only field and is never sent.
    mutationFn: ({ username, email, password }) => authApi.register({ username, email, password }),
  })
}
