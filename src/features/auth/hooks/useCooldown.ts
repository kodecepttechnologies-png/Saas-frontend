import { useCallback, useEffect, useState } from 'react'

/** Counts down once per second; used to rate-limit the "Resend code" button in the UI. */
export function useCooldown(initialSeconds = 0) {
  const [remaining, setRemaining] = useState(initialSeconds)

  useEffect(() => {
    if (remaining <= 0) return
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining])

  const start = useCallback((seconds = 30) => setRemaining(seconds), [])
  return { remaining, start }
}
