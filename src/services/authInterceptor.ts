import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { API_PREFIX, AUTH_NO_REFRESH_PATHS } from '@/utils/constants'
import { unwrapData } from '@/utils/unwrap'
import { normalizeApiError } from './errorHandler'
import { tokenStorage } from './tokenStorage'

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

/** Registered by the auth layer (Step 2) so this module never imports the router. */
let onAuthFailure: () => void = () => {}
export function setAuthFailureHandler(handler: () => void) {
  onAuthFailure = handler
}

/**
 * ASSUMPTION TO VERIFY: the docs list tokens in the login/refresh responses but do not
 * show the JSON. This is the ONE place that reads them; adjust here once confirmed.
 */
export function extractTokens(body: unknown): {
  accessToken?: string
  refreshToken?: string
} {
  const source = unwrapData(body)

  return {
    accessToken:
      typeof source.token === 'string'
        ? source.token
        : typeof source.accessToken === 'string'
          ? source.accessToken
          : undefined,

    refreshToken:
      typeof source.refreshToken === 'string'
        ? source.refreshToken
        : undefined,
  }
}

function isNoRefreshPath(url?: string): boolean {
  if (!url) return false
  const path = url.split('?')[0].replace(/\/+$/, '')
  return AUTH_NO_REFRESH_PATHS.some((p) => path.endsWith(p))
}

/** Single-flight: concurrent 401s share one refresh request. */
let refreshPromise: Promise<string> | null = null

function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return Promise.reject(new Error('No refresh token'))

  refreshPromise = axios
    // Bare axios call: no interceptors, so a failing refresh can't loop.
    .post(`${env.apiBaseUrl}${API_PREFIX}/auth/refresh-token`, { refreshToken })
    .then((res) => {
      const { accessToken, refreshToken: rotated } = extractTokens(res.data)
      if (!accessToken) throw new Error('Refresh response did not include an access token')
      tokenStorage.setTokens({ accessToken, refreshToken: rotated })
      return accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

export function attachAuthInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken()
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error?.config as RetriableConfig | undefined
      const status = error?.response?.status

      if (status === 401 && original && !original._retry && !isNoRefreshPath(original.url)) {
        original._retry = true
        try {
          const newToken = await refreshAccessToken()
          original.headers.set('Authorization', `Bearer ${newToken}`)
          return client(original)
        } catch {
          tokenStorage.clear()
          onAuthFailure()
        }
      }

      return Promise.reject(normalizeApiError(error))
    },
  )
}
