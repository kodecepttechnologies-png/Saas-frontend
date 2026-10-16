import type { Organization } from '../types/organization.types'

const PREFIX = 'saas.organization.'

function isOrganization(v: unknown): v is Organization {
  return !!v && typeof v === 'object' && typeof (v as { id?: unknown }).id === 'string'
}

/**
 * Remembers the organization created in this browser, per user id, so signing out and in again
 * does not repeat setup. Never stores tokens. Server data from /auth/me always wins over this.
 */
export const organizationStorage = {
  get(userId: string): Organization | null {
    try {
      const raw = localStorage.getItem(PREFIX + userId)
      if (!raw) return null
      const parsed: unknown = JSON.parse(raw)
      return isOrganization(parsed) ? parsed : null
    } catch {
      return null
    }
  },
  set(userId: string, organization: Organization) {
    try {
      localStorage.setItem(PREFIX + userId, JSON.stringify(organization))
    } catch {
      /* storage unavailable – setup state just won't persist */
    }
  },
  clear(userId: string) {
    try {
      localStorage.removeItem(PREFIX + userId)
    } catch {
      /* ignore */
    }
  },
}