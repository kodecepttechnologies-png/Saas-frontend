import type { Permission } from '../types/permission.types'

const featureNames: Record<string, string> = {
  employees: 'Employee Management',
  roles: 'Role Management',
  attendance: 'Attendance Management',
  departments: 'Department Management',
  designations: 'Designation Management',
  invitations: 'Employee Invitation',
  rewards: 'Reward Rules',
}

export interface PermissionGroup {
  featureId: string
  name: string
  permissions: Permission[]
}

export function groupPermissions(permissions: Permission[]): PermissionGroup[] {
  const groups = new Map<string, Permission[]>()
  for (const permission of permissions) {
    const current = groups.get(permission.featureId) ?? []
    if (!current.some((item) => item.id === permission.id)) current.push(permission)
    groups.set(permission.featureId, current)
  }
  return [...groups.entries()]
    .map(([featureId, items]) => ({
      featureId,
      name: featureNames[featureId] ?? featureId.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      permissions: items,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
