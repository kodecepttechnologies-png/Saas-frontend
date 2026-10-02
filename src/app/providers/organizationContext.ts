import { createContext } from 'react'
import type { Organization } from '@/features/organization/types/organization.types'

export interface OrganizationContextValue {
  /** The full active organization entity (source of truth from backend). */
  organization: Organization | null
  /** Needed by Departments, Designations and Roles, which take organizationId from the client. */
  organizationId: string | undefined
  /** Display name of the active organization. */
  organizationName: string | undefined
  /** Logo URL or path of the active organization. */
  organizationLogo: string | undefined
  /** True when active organization is present. */
  hasOrganization: boolean
  /** Sets the full active organization entity. */
  setOrganization: (org: Organization) => void
  /** Convenience setter for organization ID. */
  setOrganizationId: (id: string) => void
  /** Clears the active organization context. */
  clearOrganization: () => void
}

export const OrganizationContext = createContext<OrganizationContextValue | null>(null)
