import axios from 'axios'
import { env } from '@/config/env'
import { attachAuthInterceptors } from './authInterceptor'

/**
 * The one HTTP client. Every feature API module imports this – never axios directly.
 * Timeout is generous because the Render-hosted backend can be slow on a cold start.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
})

attachAuthInterceptors(apiClient)
