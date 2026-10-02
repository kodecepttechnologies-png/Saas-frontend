/**
 * The docs don't show every response body. Responses may be flat ({ accessToken })
 * or wrapped ({ data: { accessToken } }). This is the ONE place that tolerates both.
 */
export function unwrapData(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object') return {}
  const root = body as Record<string, unknown>
  const inner = root.data
  return inner && typeof inner === 'object' && !Array.isArray(inner) ? (inner as Record<string, unknown>) : root
}
