import { useNavigate } from 'react-router-dom'
import { RoleWizard } from '../components/RoleWizard'
import { useCreateRole } from '../hooks/useCreateRole'
import { usePermissions } from '../hooks/usePermissions'
import type { Permission } from '../types/permission.types'
import type { RoleFormValues } from '../schemas/role.schemas'
import { useOrganization } from '@/hooks/useOrganization'

export function CreateRolePage() {
  const navigate = useNavigate()
  const { organizationId } = useOrganization()
  const permissionsQuery = usePermissions(organizationId)
  const createRole = useCreateRole()

  const submit = async (
    values: RoleFormValues,
    selectedPermissions: Permission[],
  ) => {
    if (!organizationId) return
    try {
      const role = await createRole.mutateAsync({
        ...values,
        priority: values.priority || undefined,
        description: values.description || undefined,
        organizationId,
        permissionIds: [...new Set(values.permissionIds)],
      })
      navigate('/roles/success', {
        replace: true,
        state: { role, permissions: selectedPermissions },
      })
    } catch {
      // The mutation state exposes the normalized error in the wizard.
    }
  }

  return (
    <RoleWizard
      permissions={permissionsQuery.data ?? []}
      permissionsLoading={permissionsQuery.isLoading}
      permissionsError={permissionsQuery.error?.message}
      previewMode={!organizationId}
      organizationAvailable={!!organizationId}
      isPending={createRole.isPending}
      submitError={createRole.error?.message}
      onSubmit={submit}
    />
  )
}
