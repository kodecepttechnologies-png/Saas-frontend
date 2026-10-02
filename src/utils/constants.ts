export const API_PREFIX = '/api/v1'

export const STORAGE_KEYS = {
  accessToken: 'saas.accessToken',
  refreshToken: 'saas.refreshToken',
} as const

/**
 * Auth endpoints that must never trigger refresh-and-retry on a 401
 * (a wrong password on login is not an expired session).
 * Matched with endsWith, so '/auth/register' does not match '/auth/register-organization'.
 */
export const AUTH_NO_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email-otp',
  '/auth/resend-email-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh-token',
] as const
