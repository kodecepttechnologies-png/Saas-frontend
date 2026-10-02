import { QueryClient } from '@tanstack/react-query'
import { AppError } from '@/services/errorHandler'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Retrying a 4xx never helps; retry network/5xx once.
      retry: (failureCount, error) => {
        if (error instanceof AppError && error.status && error.status < 500) return false
        return failureCount < 1
      },
    },
  },
})
