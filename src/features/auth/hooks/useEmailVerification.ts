import { useMutation } from '@tanstack/react-query'
import type { AppError } from '@/services/errorHandler'
import { authApi } from '../api/authApi'
import type { ResendEmailOtpRequest, VerifyEmailOtpRequest } from '../types/auth.types'

export function useVerifyEmailOtp() {
  return useMutation<void, AppError, VerifyEmailOtpRequest>({ mutationFn: authApi.verifyEmailOtp })
}

export function useResendEmailOtp() {
  return useMutation<void, AppError, ResendEmailOtpRequest>({ mutationFn: authApi.resendEmailOtp })
}
