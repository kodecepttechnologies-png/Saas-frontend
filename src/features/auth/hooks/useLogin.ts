import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import type { AppError } from '@/services/errorHandler'
import { authApi } from '../api/authApi'
import type { LoginFormValues } from '../schemas/auth.schemas'

export function useLogin() {
  const { signIn } = useAuth()

  return useMutation<
    Awaited<ReturnType<typeof authApi.login>>,
    AppError,
    LoginFormValues
  >({
    mutationFn: (values) =>
      authApi.login({
        email: values.email,
        password: values.password,
      }),

    onSuccess: (session) => {
      signIn(session)
    },
  })
}