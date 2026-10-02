/** Documented fields for POST /api/v1/auth/register-organization (multipart/form-data). */
export interface OrganizationRegistrationPayload {
  organizationName: string
  industry: string
  workspaceUrl: string
  timezone: string
  language: string
  theme: string
  termsAccepted: boolean
  /** Optional logo upload file. */
  logo?: File
}

/** Backward-compatible alias for the registration payload. */
export type RegisterOrganizationInput = OrganizationRegistrationPayload

/**
 * Normalized active organization entity.
 * Source of truth comes from backend responses (/auth/register-organization or /auth/me).
 */
export interface Organization {
  id: string
  name: string
  industry?: string
  workspaceUrl?: string
  timezone?: string
  language?: string
  theme?: string
  /** URL or server path to the uploaded logo */
  logo?: string
  createdAt?: string
  updatedAt?: string
  /** Preserves any additional properties returned by backend */
  raw?: Record<string, unknown>
}

/** Normalized return value from organizationApi.register. */
export interface RegisterOrganizationResponse {
  raw: unknown
  organization?: Organization | null
  organizationId?: string
}
