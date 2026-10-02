import { AppError } from '@/services/errorHandler'
import { extractTokens } from '@/services/authInterceptor'
import { unwrapData } from '@/utils/unwrap'
import type { AuthSession, AuthUser } from '../types/auth.types'

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

/** Login response: access token + refresh token + user (field names assumed, see extractTokens). */
export function extractAuthSession(body: unknown): AuthSession {
  const { accessToken, refreshToken } = extractTokens(body)
  if (!accessToken) {
    throw new AppError('Sign-in worked but the server sent no session. Please try again.')
  }
  const user = unwrapData(body).user
  return { accessToken, refreshToken, user: isObject(user) ? (user as AuthUser) : undefined }
}

/** /auth/me response: either { user: {...} } or the user object itself. */
export function extractUser(body: unknown): AuthUser {
  const source = unwrapData(body)
  return (isObject(source.user) ? source.user : source) as AuthUser
}
