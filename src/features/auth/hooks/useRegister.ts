import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import type { AppError } from '@/services/errorHandler'
import { authApi } from '../api/authApi'
import type { RegisterFormValues } from '../schemas/auth.schemas'
import type { AuthSession } from '../types/auth.types'

export function useRegister() {
  const { signIn } = useAuth()

  return useMutation<AuthSession | void, AppError, RegisterFormValues>({
    mutationFn: async ({ username, email, password }) => {
      // 1. Register with backend
      const session = await authApi.register({ username, email, password })
      if (session?.accessToken) {
        return session
      }

      // 2. If register succeeded without session tokens, attempt login to obtain JWT session
      try {
        const loginSession = await authApi.login({ email, password })
        return loginSession
      } catch {
        return session
      }
    },
    onSuccess: (session) => {
      if (session) {
        signIn(session)
      }
    },
  })
}
