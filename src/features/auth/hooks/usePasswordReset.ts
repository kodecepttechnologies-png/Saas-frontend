import { useMutation } from '@tanstack/react-query'
import type { AppError } from '@/services/errorHandler'
import { authApi } from '../api/authApi'
import type { ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth.types'

export function useForgotPassword() {
  return useMutation<void, AppError, ForgotPasswordRequest>({ mutationFn: authApi.forgotPassword })
}

export function useResetPassword() {
  return useMutation<void, AppError, ResetPasswordRequest>({ mutationFn: authApi.resetPassword })
}
