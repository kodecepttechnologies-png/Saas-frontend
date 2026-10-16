import type { Permission } from '../types/permission.types'

const actions = [
  { action: 'view', verb: 'View' },
  { action: 'create', verb: 'Create' },
  { action: 'update', verb: 'Update' },
  { action: 'delete', verb: 'Delete' },
]

const features = [
  { id: 'employees', name: 'Employee Management' },
  { id: 'roles', name: 'Role Management' },
  { id: 'attendance', name: 'Attendance Management' },
  { id: 'departments', name: 'Department Management' },
  { id: 'designations', name: 'Designation Management' },
  { id: 'invitations', name: 'Employee Invitation', actions: actions.slice(0, 2) },
  { id: 'rewards', name: 'Reward Rules' },
]

export const mockPermissions: Permission[] = features.flatMap((feature) =>
  (feature.actions ?? actions).map(({ action, verb }) => ({
    id: `preview-${feature.id}-${action}`,
    featureId: feature.id,
    action,
    name: `${verb} ${feature.name.replace(/ Management$/, '').replace(/s$/, '')}`,
  })),
)
