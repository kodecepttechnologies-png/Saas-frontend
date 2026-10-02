import type { AuthUser } from '@/features/auth/types/auth.types'
import { unwrapData } from '@/utils/unwrap'
import type { Organization, OrganizationRegistrationPayload } from '../types/organization.types'

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function asString(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim().length > 0) return v.trim()
  return undefined
}

/**
 * Normalizes an organization record into a typed Organization entity.
 * Handles both _id and id, organizationName and name, logo and logoUrl.
 */
export function normalizeOrganization(source: Record<string, unknown>): Organization | null {
  const id = asString(source._id) ?? asString(source.id) ?? asString(source.organizationId)
  const name = asString(source.organizationName) ?? asString(source.name)

  if (!id && !name) {
    return null
  }

  const logo = asString(source.logo) ?? asString(source.logoUrl) ?? asString(source.logoPath)

  return {
    id: id ?? '',
    name: name ?? 'Workspace',
    industry: asString(source.industry),
    workspaceUrl: asString(source.workspaceUrl),
    timezone: asString(source.timezone),
    language: asString(source.language),
    theme: asString(source.theme),
    logo,
    createdAt: asString(source.createdAt),
    updatedAt: asString(source.updatedAt),
    raw: source,
  }
}

/**
 * Extracts organization data from the register-organization backend response.
 * Tolerates:
 * - { organization: { _id, organizationName, ... } }
 * - { data: { organization: { ... } } }
 * - { data: { _id, organizationName, ... } }
 * - Flat { _id, organizationName, ... }
 * - { organizationId: "..." }
 * If the response omits name/metadata but provides an ID, fall back to values from the registration payload.
 */
export function extractOrganization(
  body: unknown,
  fallbackInput?: Partial<OrganizationRegistrationPayload>,
): Organization | null {
  const src = unwrapData(body)

  if (isObject(src.organization)) {
    const org = normalizeOrganization(src.organization)
    if (org) {
      if ((!org.name || org.name === 'Workspace') && fallbackInput?.organizationName) {
        org.name = fallbackInput.organizationName
      }
      if (!org.workspaceUrl && fallbackInput?.workspaceUrl) org.workspaceUrl = fallbackInput.workspaceUrl
      if (!org.industry && fallbackInput?.industry) org.industry = fallbackInput.industry
      if (!org.timezone && fallbackInput?.timezone) org.timezone = fallbackInput.timezone
      if (!org.language && fallbackInput?.language) org.language = fallbackInput.language
      if (!org.theme && fallbackInput?.theme) org.theme = fallbackInput.theme
      return org
    }
  }

  if (isObject(src.data) && isObject(src.data.organization)) {
    const org = normalizeOrganization(src.data.organization as Record<string, unknown>)
    if (org) return org
  }

  // Check if src itself is the organization record
  const directOrg = normalizeOrganization(src)
  if (directOrg && (directOrg.id || directOrg.workspaceUrl || typeof src.organizationName === 'string')) {
    if ((!directOrg.name || directOrg.name === 'Workspace') && fallbackInput?.organizationName) {
      directOrg.name = fallbackInput.organizationName
    }
    return directOrg
  }

  // Check for bare organizationId
  const id = asString(src.organizationId) ?? asString(src.id) ?? asString(src._id)
  if (id) {
    return {
      id,
      name: fallbackInput?.organizationName || 'Workspace',
      industry: fallbackInput?.industry,
      workspaceUrl: fallbackInput?.workspaceUrl,
      timezone: fallbackInput?.timezone,
      language: fallbackInput?.language,
      theme: fallbackInput?.theme,
      raw: src,
    }
  }

  return null
}

export function extractOrganizationId(body: unknown): string | undefined {
  const org = extractOrganization(body)
  return org?.id || undefined
}

/**
 * Extracts organization information from the authenticated user object (/auth/me).
 * Supports user.organization as an object or id string, user.organizationId, etc.
 */
export function organizationFromUser(user: AuthUser | undefined): Organization | null {
  if (!user) return null

  if (isObject(user.organization)) {
    const org = normalizeOrganization(user.organization)
    if (org) return org
  }

  const id =
    asString(user.organizationId) ??
    (typeof user.organization === 'string' ? asString(user.organization) : undefined)
  const name = asString(user.organizationName) ?? asString(user.companyName)
  const logo = asString(user.organizationLogo) ?? asString(user.companyLogo)

  if (id || name) {
    return {
      id: id ?? '',
      name: name ?? 'Workspace',
      logo,
      raw: user,
    }
  }

  return null
}

export function organizationIdFromUser(user: AuthUser | undefined): string | undefined {
  const org = organizationFromUser(user)
  return org?.id || undefined
}
