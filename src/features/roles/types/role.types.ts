import type { Permission } from './permission.types'

export interface Role {
  id: string
  organizationId: string
  name: string
  priority?: string
  description?: string
  isSystemRole: boolean
  createdAt?: string
  updatedAt?: string
  permissions?: Permission[]
  permissionIds?: string[]
}

export interface CreateRolePayload {
  organizationId: string
  name: string
  priority?: string
  description?: string
  isSystemRole: boolean
  permissionIds: string[]
}
