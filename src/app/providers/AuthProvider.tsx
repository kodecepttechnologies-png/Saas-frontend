import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/authApi'
import { authKeys } from '@/features/auth/api/authKeys'
import { setAuthFailureHandler } from '@/services/authInterceptor'
import { tokenStorage } from '@/services/tokenStorage'
import { AuthContext, type AuthContextValue, type AuthStatus } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = useState(() => !!tokenStorage.getAccessToken())

  // Current user is server state; /auth/me is the single source of identity.
  const me = useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60_000,
  })

  const signOut = useCallback(() => {
    tokenStorage.clear()
    setHasToken(false)
    queryClient.clear()
  }, [queryClient])

  // The API client calls this when a token refresh fails.
  useEffect(() => {
    setAuthFailureHandler(signOut)
  }, [signOut])

  const signIn = useCallback<AuthContextValue['signIn']>(
    (session) => {
      tokenStorage.setTokens(session)
      setHasToken(true)
      void queryClient.invalidateQueries({ queryKey: authKeys.me })
    },
    [queryClient],
  )

  const retryUser = useCallback(() => void me.refetch(), [me])

  let status: AuthStatus
  if (!hasToken) status = 'unauthenticated'
  else if (me.isError) status = 'error'
  else if (me.data) status = 'authenticated'
  else status = 'loading'

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: me.data,
      errorMessage: me.error?.message,
      signIn,
      signOut,
      retryUser,
    }),
    [status, me.data, me.error, signIn, signOut, retryUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
