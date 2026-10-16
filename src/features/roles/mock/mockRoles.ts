import type { Role } from '../types/role.types'
import { mockPermissions } from './mockPermissions'

export const mockRoles: Role[] = [{
  id: 'preview-hr-role',
  organizationId: '',
  name: 'HR',
  priority: 'high',
  description: 'Human resources management role',
  isSystemRole: false,
  permissionIds: mockPermissions
    .filter((permission) => ['employees', 'roles'].includes(permission.featureId) ||
      (permission.featureId === 'attendance' && permission.action === 'view'))
    .map((permission) => permission.id),
}]
