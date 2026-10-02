/**
 * The backend documents no universal error schema, so features only ever see this
 * normalized shape (produced in services/errorHandler.ts).
 */
export interface ApiErrorShape {
  message: string
  status?: number
  details?: unknown
  isNetworkError: boolean
}
