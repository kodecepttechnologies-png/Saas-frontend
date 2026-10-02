import type { Organization } from '../types/organization.types'

const KEY = 'saas.organization'
const LEGACY_ID_KEY = 'saas.organizationId'

/**
 * Manages client-side persistence for the active organization identity.
 * Security rule: Never stores auth tokens or credentials.
 * The backend remains the source of truth; this preserves identity during navigation.
 */
export const organizationStorage = {
  get(): Organization | null {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Organization
        if (parsed && typeof parsed === 'object' && (parsed.id || parsed.name)) {
          return parsed
        }
      }
      const legacyId = localStorage.getItem(LEGACY_ID_KEY)
      if (legacyId) {
        return { id: legacyId, name: 'Workspace' }
      }
      return null
    } catch {
      return null
    }
  },

  getId(): string | undefined {
    return this.get()?.id
  },

  set(org: Organization | string) {
    try {
      if (typeof org === 'string') {
        const existing = this.get()
        const updated: Organization = existing ? { ...existing, id: org } : { id: org, name: 'Workspace' }
        localStorage.setItem(KEY, JSON.stringify(updated))
        localStorage.setItem(LEGACY_ID_KEY, org)
      } else {
        localStorage.setItem(KEY, JSON.stringify(org))
        if (org.id) localStorage.setItem(LEGACY_ID_KEY, org.id)
      }
    } catch {
      /* ignore storage write failures (e.g. incognito) */
    }
  },

  clear() {
    try {
      localStorage.removeItem(KEY)
      localStorage.removeItem(LEGACY_ID_KEY)
    } catch {
      /* ignore */
    }
  },
}
