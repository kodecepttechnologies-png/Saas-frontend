import { apiClient } from '@/services/apiClient'
import { API_PREFIX } from '@/utils/constants'
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendEmailOtpRequest,
  ResetPasswordRequest,
  VerifyEmailOtpRequest,
} from '../types/auth.types'
import { extractAuthSession, extractUser } from '../utils/session'

const base = `${API_PREFIX}/auth`

export const authApi = {
  async register(payload: RegisterRequest): Promise<void> {
    await apiClient.post(`${base}/register`, payload)
  },

  async login(payload: LoginRequest): Promise<AuthSession> {
  const { data } = await apiClient.post(`${base}/login`, payload)
  return extractAuthSession(data)
},

  async verifyEmailOtp(payload: VerifyEmailOtpRequest): Promise<void> {
    await apiClient.post(`${base}/verify-email-otp`, payload)
  },

  async resendEmailOtp(payload: ResendEmailOtpRequest): Promise<void> {
    await apiClient.post(`${base}/resend-email-otp`, payload)
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(`${base}/forgot-password`, payload)
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await apiClient.post(`${base}/reset-password`, payload)
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get(`${base}/me`)
    return extractUser(data)
  },
}
