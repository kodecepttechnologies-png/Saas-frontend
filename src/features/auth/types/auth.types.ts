/** Documented in the API spec. */
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

/**
 * ASSUMED request bodies: the spec lists these endpoints but not their JSON.
 * Confirm field names against the backend; fix them here and in authApi.ts only.
 */
export interface VerifyEmailOtpRequest {
  email: string
  otp: string
}
export interface ResendEmailOtpRequest {
  email: string
}
export interface ForgotPasswordRequest {
  email: string
}
export interface ResetPasswordRequest {
  token: string
  password: string
}

/** User shape is not documented – only the fields the UI reads are named. */
export type AuthUser = {
  id?: string
  _id?: string
  username?: string
  email?: string
} & Record<string, unknown>

export interface AuthSession {
  accessToken: string
  refreshToken?: string
  user?: AuthUser
}
