import { createContext } from 'react'
import type { AuthSession, AuthUser } from '@/features/auth/types/auth.types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthContextValue {
  status: AuthStatus
  user: AuthUser | undefined
  errorMessage: string | undefined
  /** Persist tokens after a successful login; /auth/me is then fetched. */
  signIn: (session: Pick<AuthSession, 'accessToken' | 'refreshToken'>) => void
  /** No logout endpoint is documented, so this clears local session state only. */
  signOut: () => void
  retryUser: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
