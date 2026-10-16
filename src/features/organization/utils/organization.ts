import type { AuthUser } from '@/features/auth/types/auth.types'
import { unwrapData } from '@/utils/unwrap'
import type {
  Organization,
  OrganizationRegistrationPayload,
} from '../types/organization.types'

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value)
  )
}

function asString(
  value: unknown,
): string | undefined {
  if (
    typeof value === 'string' &&
    value.trim().length > 0
  ) {
    return value.trim()
  }

  return undefined
}

/**
 * Converts a backend organization object into the
 * frontend Organization model.
 *
 * Backend currently returns:
 *
 * {
 *   customId: "ORG-OG5G_W",
 *   name: "xyz company",
 *   slug: "xyz-company",
 *   logoUrl: null,
 *   status: "active"
 * }
 *
 * Therefore customId MUST be treated as the organization ID.
 */
export function normalizeOrganization(
  source: Record<string, unknown>,
): Organization | null {
  /*
   * Backend organization identifier.
   *
   * Priority:
   *
   * _id
   * id
   * customId
   * organizationId
   */
  const id =
    asString(source._id) ??
    asString(source.id) ??
    asString(source.customId) ??
    asString(source.organizationId)

  const name =
    asString(source.organizationName) ??
    asString(source.name)

  /*
   * If neither an ID nor a name exists,
   * this is not an organization object.
   */
  if (!id && !name) {
    return null
  }

  const logo =
    asString(source.logo) ??
    asString(source.logoUrl) ??
    asString(source.logoPath)

  const workspaceUrl =
    asString(source.workspaceUrl) ??
    asString(source.slug)

  const slug =
    asString(source.slug) ??
    workspaceUrl

  return {
    id: id ?? '',

    name:
      name ?? 'Workspace',

    industry:
      asString(source.industry),

    workspaceUrl,

    slug,

    timezone:
      asString(source.timezone),

    language:
      asString(source.language),

    theme:
      asString(source.theme),

    logo,

    logoUrl:
      logo,

    createdAt:
      asString(source.createdAt),

    updatedAt:
      asString(source.updatedAt),

    raw: source,
  }
}

/**
 * Extract organization from the API response.
 */
export function extractOrganization(
  body: unknown,
  fallbackInput?: Partial<OrganizationRegistrationPayload>,
): Organization | null {
  const src = unwrapData(body)

  /*
   * Case 1:
   *
   * {
   *   data: {
   *     organization: {...}
   *   }
   * }
   */
  if (isObject(src.organization)) {
    const organization =
      normalizeOrganization(
        src.organization,
      )

    if (organization) {
      if (
        (!organization.name ||
          organization.name === 'Workspace') &&
        fallbackInput?.organizationName
      ) {
        organization.name =
          fallbackInput.organizationName
      }

      if (
        !organization.workspaceUrl &&
        fallbackInput?.workspaceUrl
      ) {
        organization.workspaceUrl =
          fallbackInput.workspaceUrl
      }

      if (!organization.slug) {
        organization.slug =
          organization.workspaceUrl ??
          fallbackInput?.workspaceUrl
      }

      if (!organization.logoUrl) {
        organization.logoUrl =
          organization.logo
      }

      if (
        !organization.industry &&
        fallbackInput?.industry
      ) {
        organization.industry =
          fallbackInput.industry
      }

      if (
        !organization.timezone &&
        fallbackInput?.timezone
      ) {
        organization.timezone =
          fallbackInput.timezone
      }

      if (
        !organization.language &&
        fallbackInput?.language
      ) {
        organization.language =
          fallbackInput.language
      }

      if (
        !organization.theme &&
        fallbackInput?.theme
      ) {
        organization.theme =
          fallbackInput.theme
      }

      return organization
    }
  }

  /*
   * Case 2:
   *
   * {
   *   data: {
   *     data: {
   *       organization: {...}
   *     }
   *   }
   * }
   */
  if (
    isObject(src.data) &&
    isObject(src.data.organization)
  ) {
    const organization =
      normalizeOrganization(
        src.data.organization,
      )

    if (organization) {
      return organization
    }
  }

  /*
   * Case 3:
   *
   * Backend response currently looks like:
   *
   * {
   *   success: true,
   *   message: "...",
   *   data: {
   *     customId: "ORG-OG5G_W",
   *     name: "xyz company",
   *     slug: "xyz-company"
   *   }
   * }
   *
   * unwrapData(body) gives us the data object.
   */
  const directOrganization =
    normalizeOrganization(src)

  if (
    directOrganization &&
    (
      directOrganization.id ||
      directOrganization.workspaceUrl ||
      directOrganization.slug ||
      typeof src.organizationName === 'string'
    )
  ) {
    if (
      (!directOrganization.name ||
        directOrganization.name === 'Workspace') &&
      fallbackInput?.organizationName
    ) {
      directOrganization.name =
        fallbackInput.organizationName
    }

    if (
      !directOrganization.workspaceUrl &&
      fallbackInput?.workspaceUrl
    ) {
      directOrganization.workspaceUrl =
        fallbackInput.workspaceUrl
    }

    if (!directOrganization.slug) {
      directOrganization.slug =
        directOrganization.workspaceUrl ??
        fallbackInput?.workspaceUrl
    }

    if (
      !directOrganization.industry &&
      fallbackInput?.industry
    ) {
      directOrganization.industry =
        fallbackInput.industry
    }

    if (
      !directOrganization.timezone &&
      fallbackInput?.timezone
    ) {
      directOrganization.timezone =
        fallbackInput.timezone
    }

    if (
      !directOrganization.language &&
      fallbackInput?.language
    ) {
      directOrganization.language =
        fallbackInput.language
    }

    if (
      !directOrganization.theme &&
      fallbackInput?.theme
    ) {
      directOrganization.theme =
        fallbackInput.theme
    }

    return directOrganization
  }

  /*
   * Case 4:
   *
   * API only returns an organization ID.
   */
  const id =
    asString(src.organizationId) ??
    asString(src.customId) ??
    asString(src.id) ??
    asString(src._id)

  if (id) {
    const fallbackSlug =
      fallbackInput?.workspaceUrl

    return {
      id,

      name:
        fallbackInput?.organizationName ??
        'Workspace',

      industry:
        fallbackInput?.industry,

      workspaceUrl:
        fallbackInput?.workspaceUrl,

      slug:
        fallbackSlug,

      timezone:
        fallbackInput?.timezone,

      language:
        fallbackInput?.language,

      theme:
        fallbackInput?.theme,

      raw: src,
    }
  }

  return null
}

/**
 * Extract organization ID from an API response.
 */
export function extractOrganizationId(
  body: unknown,
): string | undefined {
  const organization =
    extractOrganization(body)

  return (
    organization?.id ||
    undefined
  )
}

/**
 * Extract organization information from
 * the authenticated user.
 */
export function organizationFromUser(
  user: AuthUser | undefined,
): Organization | null {
  if (!user) {
    return null
  }

  /*
   * User may contain the complete organization object.
   */
  if (isObject(user.organization)) {
    const organization =
      normalizeOrganization(
        user.organization,
      )

    if (organization) {
      return organization
    }
  }

  /*
   * User may only contain organization ID.
   */
  const id =
    asString(user.organizationId) ??
    (
      typeof user.organization === 'string'
        ? asString(user.organization)
        : undefined
    )

  const name =
    asString(user.organizationName) ??
    asString(user.companyName)

  const logo =
    asString(user.organizationLogo) ??
    asString(user.companyLogo)

  if (id || name) {
    return {
      id: id ?? '',

      name:
        name ?? 'Workspace',

      logo,

      logoUrl:
        logo,

      raw: user,
    }
  }

  return null
}

export function organizationOwnerKey(
  user: AuthUser | undefined,
): string | undefined {
  if (!user) return undefined

  const id =
    asString(user._id) ??
    asString(user.id) ??
    asString(user.userId) ??
    asString(user.customId)

  if (id) return `id:${id}`

  const email = asString(user.email)
  if (email) return `email:${email.toLowerCase()}`

  const username = asString(user.username)
  return username ? `username:${username.toLowerCase()}` : undefined
}

/**
 * Get the organization ID associated with
 * the authenticated user.
 */
export function organizationIdFromUser(
  user: AuthUser | undefined,
): string | undefined {
  const organization =
    organizationFromUser(user)

  return (
    organization?.id ||
    undefined
  )
}