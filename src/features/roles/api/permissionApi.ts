import { apiClient } from '@/services/apiClient'
import { AppError } from '@/services/errorHandler'
import { API_PREFIX } from '@/utils/constants'
import { unwrapData } from '@/utils/unwrap'
import type { Permission } from '../types/permission.types'

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function normalizePermission(value: unknown): Permission | null {
  const item = asRecord(value)
  if (!item) return null
  const id = item.id ?? item._id ?? item.customId ?? item.permissionId
  const featureId = item.featureId
  const action = item.action
  const name = item.name
  if (
    typeof id !== 'string' ||
    typeof featureId !== 'string' ||
    typeof action !== 'string' ||
    typeof name !== 'string'
  ) return null
  return {
    id,
    featureId,
    action,
    name,
    description: typeof item.description === 'string' ? item.description : undefined,
  }
}

function extractPermissions(body: unknown): Permission[] {
  const root = asRecord(body)
  const data = root?.data ?? body
  const record = asRecord(data)
  const nestedData = record?.data
  const rows = Array.isArray(data)
    ? data
    : Array.isArray(nestedData)
      ? nestedData
      : record?.permissions ?? record?.items ?? record?.results
  if (!Array.isArray(rows)) throw new AppError('The permissions response had an unexpected format.')
  const permissions = rows.map(normalizePermission)
  if (permissions.some((permission) => !permission)) {
    throw new AppError('One or more permissions could not be read from the server.')
  }
  return permissions.filter((permission): permission is Permission => !!permission)
}

export const permissionApi = {
  async getPermissions(): Promise<Permission[]> {
    const { data } = await apiClient.get(`${API_PREFIX}/permissions/`)
    return extractPermissions(data)
  },

  async getPermissionsByFeature(featureId: string): Promise<Permission[]> {
    const { data } = await apiClient.get(
      `${API_PREFIX}/permissions/feature/${encodeURIComponent(featureId)}`,
    )
    return extractPermissions(data)
  },

  async getPermission(id: string): Promise<Permission | null> {
    const { data } = await apiClient.get(`${API_PREFIX}/permissions/${encodeURIComponent(id)}`)
    const response = asRecord(unwrapData(data))
    return normalizePermission(response?.permission ?? response)
  },
}
