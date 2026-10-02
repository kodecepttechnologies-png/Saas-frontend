import { STORAGE_KEYS } from '@/utils/constants'

/** The only module that touches token persistence. Feature APIs never read tokens directly. */
function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable (private mode, quota) – session just won't persist */
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export const tokenStorage = {
  getAccessToken: () => safeGet(STORAGE_KEYS.accessToken),
  getRefreshToken: () => safeGet(STORAGE_KEYS.refreshToken),
  setTokens(tokens: { accessToken: string; refreshToken?: string }) {
    safeSet(STORAGE_KEYS.accessToken, tokens.accessToken)
    if (tokens.refreshToken) safeSet(STORAGE_KEYS.refreshToken, tokens.refreshToken)
  },
  clear() {
    safeRemove(STORAGE_KEYS.accessToken)
    safeRemove(STORAGE_KEYS.refreshToken)
  },
}
