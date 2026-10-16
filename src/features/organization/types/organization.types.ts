/**
 * Fields accepted by:
 *
 * POST /api/v1/auth/register-organization
 *
 * Content-Type:
 * multipart/form-data
 */
export interface OrganizationRegistrationPayload {
  /**
   * User-facing organization name.
   *
   * Example:
   * Acme Technologies
   */
  organizationName: string

  /**
   * Organization industry.
   *
   * Example:
   * Software
   */
  industry: string

  /**
   * Workspace slug.
   *
   * Example:
   * acme-technologies
   *
   * This value is mapped by the backend to:
   *
   * slug: dto.workspaceUrl
   */
  workspaceUrl: string

  /**
   * IANA timezone.
   *
   * Example:
   * Asia/Kolkata
   */
  timezone: string

  /**
   * Language code.
   *
   * Example:
   * en
   */
  language: string

  /**
   * Workspace theme.
   *
   * Example:
   * dark
   */
  theme: string

  /**
   * Terms acceptance.
   */
  termsAccepted: boolean

  /**
   * Optional organization logo.
   */
  logo?: File
}

/**
 * Backward-compatible alias.
 */
export type RegisterOrganizationInput =
  OrganizationRegistrationPayload

/**
 * Normalized organization entity used by the frontend.
 *
 * Backend organization fields are normalized here so
 * the rest of the application does not need to know
 * whether the backend returns:
 *
 * id / _id
 * name / organizationName
 * slug / workspaceUrl
 * logoUrl / logo
 */
export interface Organization {
  /**
   * Backend organization identifier.
   *
   * Can come from:
   * id
   * _id
   * organizationId
   */
  id: string

  /**
   * Organization name.
   */
  name: string

  /**
   * Backend organization slug.
   */
  slug?: string

  /**
   * Same slug exposed as workspaceUrl for
   * frontend compatibility.
   */
  workspaceUrl?: string

  /**
   * Organization industry.
   */
  industry?: string

  /**
   * Organization timezone.
   */
  timezone?: string

  /**
   * Backend setting:
   * primary_language
   */
  language?: string

  /**
   * Backend setting:
   * theme_preference
   */
  theme?: string

  /**
   * Organization logo.
   */
  logo?: string

  /**
   * Backend logoUrl.
   */
  logoUrl?: string

  /**
   * Organization status.
   */
  status?: string

  /**
   * Backend generated custom ID.
   */
  customId?: string

  /**
   * Owner user ID if returned by backend.
   */
  ownerUserId?: string

  /**
   * Creation timestamp.
   */
  createdAt?: string

  /**
   * Update timestamp.
   */
  updatedAt?: string

  /**
   * Original backend response.
   */
  raw?: Record<string, unknown>
}

/**
 * Normalized organization registration response.
 */
export interface RegisterOrganizationResponse {
  raw: unknown
  organization?: Organization | null
  organizationId?: string
}

/**
 * Organization setup step.
 */
export type OrganizationSetupStep = 1 | 2 | 3

export interface StepItem {
  id: OrganizationSetupStep
  title: string
  subtitle: string
}

export const SETUP_STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Organization Information',
    subtitle: 'Tell us about your organization',
  },
  {
    id: 2,
    title: 'Configure your workspace',
    subtitle:
      'Choose how your workspace should look and work',
  },
  {
    id: 3,
    title: "You're all set!",
    subtitle:
      'Review and launch your organization',
  },
]