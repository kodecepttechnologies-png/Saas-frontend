import axios from 'axios'
import type { ApiErrorShape } from '@/types/api'

export class AppError extends Error implements ApiErrorShape {
  status?: number
  details?: unknown
  isNetworkError: boolean

  constructor(message: string, opts: { status?: number; details?: unknown; isNetworkError?: boolean } = {}) {
    super(message)
    this.name = 'AppError'
    this.status = opts.status
    this.details = opts.details
    this.isNetworkError = opts.isNetworkError ?? false
  }
}

/** Best-effort message pick – the backend does not document one error schema. */
function pickMessage(data: unknown): string | undefined {
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    if (typeof record.message === 'string' && record.message.trim()) return record.message
    if (typeof record.error === 'string' && record.error.trim()) return record.error
  }
  return undefined
}

function fallbackForStatus(status: number): string {
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have access to this.'
  if (status === 404) return 'We could not find what you were looking for.'
  if (status >= 500) return 'The server ran into a problem. Please try again shortly.'
  return 'Something went wrong. Please try again.'
}

/** Convert anything thrown by the HTTP layer into an AppError. Already-normalized errors pass through. */
export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response
      return new AppError(pickMessage(data) ?? fallbackForStatus(status), { status, details: data })
    }
    if (error.code === 'ECONNABORTED') {
      return new AppError('The server took too long to respond. Please try again.', { isNetworkError: true })
    }
    return new AppError('Cannot reach the server. Check your connection and try again.', { isNetworkError: true })
  }

  if (error instanceof Error) return new AppError(error.message)
  return new AppError('Something went wrong. Please try again.')
}
