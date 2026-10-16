import { apiClient } from '@/services/apiClient'
import { AppError } from '@/services/errorHandler'
import { API_PREFIX } from '@/utils/constants'
import { unwrapData } from '@/utils/unwrap'
import type {
  CreateRolePayload,
  Role,
} from '../types/role.types'

function asRecord(
  value: unknown,
): Record<string, unknown> | undefined {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value)
  )
    ? (value as Record<string, unknown>)
    : undefined
}

function asString(
  value: unknown,
): string | undefined {
  return typeof value === 'string' &&
    value.trim()
    ? value.trim()
    : undefined
}

function normalizeRole(
  value: unknown,
  fallback?: CreateRolePayload,
): Role | null {
  const item = asRecord(value)

  if (!item) {
    return null
  }

  const id =
    asString(item.id) ??
    asString(item._id) ??
    asString(item.customId) ??
    asString(item.roleId) ??
    ''

  const name =
    asString(item.name) ??
    fallback?.name

  if (!name) {
    return null
  }

  const returnedPermissionIds =
    Array.isArray(item.permissionIds)
      ? item.permissionIds
      : Array.isArray(item.permissions)
        ? item.permissions.map(
            (permission) => {
              if (
                typeof permission ===
                'string'
              ) {
                return permission
              }

              const record =
                asRecord(permission)

              return (
                record?.id ??
                record?._id ??
                record?.customId ??
                record?.permissionId
              )
            },
          )
        : undefined

  const permissionIds =
    returnedPermissionIds
      ? [
          ...new Set(
            returnedPermissionIds.filter(
              (
                permissionId,
              ): permissionId is string =>
                typeof permissionId ===
                'string',
            ),
          ),
        ]
      : undefined

  return {
    id,

    organizationId:
      asString(
        item.organizationId,
      ) ??
      fallback?.organizationId ??
      '',

    name,

    priority:
      asString(item.priority) ??
      fallback?.priority,

    description:
      asString(item.description) ??
      fallback?.description,

    isSystemRole:
      typeof item.isSystemRole ===
      'boolean'
        ? item.isSystemRole
        : fallback?.isSystemRole ??
          false,

    createdAt:
      asString(item.createdAt),

    updatedAt:
      asString(item.updatedAt),

    permissionIds,
  }
}

function extractRoles(
  body: unknown,
): Role[] {
  const root = asRecord(body)

  const data =
    root?.data ?? body

  const record =
    asRecord(data)

  const nestedData =
    record?.data

  const rows =
    Array.isArray(data)
      ? data
      : Array.isArray(nestedData)
        ? nestedData
        : record?.roles ??
          record?.items ??
          record?.results

  if (!Array.isArray(rows)) {
    throw new AppError(
      'The roles response had an unexpected format.',
    )
  }

  const roles =
    rows.map((row) =>
      normalizeRole(row),
    )

  if (
    roles.some(
      (role) => !role,
    )
  ) {
    throw new AppError(
      'One or more roles could not be read from the server.',
    )
  }

  return roles.filter(
    (
      role,
    ): role is Role =>
      !!role,
  )
}

export const roleApi = {
  /**
   * Get all roles.
   *
   * Backend endpoint:
   * GET /api/v1/roles/
   */
  async getRoles(): Promise<Role[]> {
    const { data } = await apiClient.get(`${API_PREFIX}/roles/`)
    return extractRoles(data)
  },

  /**
   * Search roles by name.
   *
   * Backend endpoint:
   * GET /api/v1/roles/search
   */
  async searchRoles(
    search: string,
    organizationId?: string,
  ): Promise<Role[]> {
    const params: Record<string, string> = {
      name: search,
    }

    if (organizationId) {
      params.organizationId = organizationId
    }

    const { data } = await apiClient.get(
      `${API_PREFIX}/roles/search`,
      { params },
    )

    return extractRoles(data)
  },

  /**
   * Create a role.
   *
   * organizationId is already part of
   * CreateRolePayload and is therefore sent
   * in the request body.
   */
  async createRole(
    payload: CreateRolePayload,
  ): Promise<Role> {
    if (!payload.organizationId) {
      throw new AppError(
        'Organization ID is required to create a role.',
      )
    }

    const { data } =
      await apiClient.post(
        `${API_PREFIX}/roles/`,
        payload,
      )

    const response =
      asRecord(data)

    const unwrapped =
      unwrapData(data)

    const source =
      unwrapped.role ??
      unwrapped.data ??
      response?.role ??
      unwrapped

    const role =
      normalizeRole(
        source,
        payload,
      )

    if (!role) {
      throw new AppError(
        'The role was created, but its details could not be read.',
      )
    }

    return role
  },
}