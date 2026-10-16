import { Check, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Badge, buttonStyles, Card, PageHeader } from '@/components/ui'
import { groupPermissions } from '../utils/permissionGrouping'
import type { Permission } from '../types/permission.types'
import type { Role } from '../types/role.types'

interface SuccessState {
  role: Role
  permissions: Permission[]
}

function isSuccessState(value: unknown): value is SuccessState {
  if (!value || typeof value !== 'object') return false
  const state = value as Record<string, unknown>
  return !!state.role && typeof state.role === 'object' && Array.isArray(state.permissions)
}

export function RoleSuccessPage() {
  const location = useLocation()
  if (!isSuccessState(location.state)) return <Navigate to="/roles" replace />

  const { role, permissions } = location.state
  const groups = groupPermissions(permissions)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Role created successfully" description="The role has been created and the selected permissions have been assigned." />
      <Card className="space-y-6 p-5 text-center sm:p-9">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <Check aria-hidden="true" className="h-8 w-8" strokeWidth={3} />
        </div>
        <div>
          <Badge tone="success">Role created</Badge>
          <h2 className="mt-3 text-2xl font-bold text-fg">{role.name}</h2>
          <p className="mt-2 text-sm text-fg-muted">{role.description || 'Your role is ready to be assigned to employees.'}</p>
        </div>

        <div className="grid gap-3 rounded-xl border border-border bg-surface-secondary/40 p-4 text-left sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">Priority</p>
            <p className="mt-1 font-semibold capitalize text-fg">{role.priority || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">Role type</p>
            <p className="mt-1 font-semibold text-fg">{role.isSystemRole ? 'System Role' : 'Custom Role'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">Permissions</p>
            <p className="mt-1 font-semibold text-fg">{permissions.length} assigned</p>
          </div>
        </div>

        <div className="text-left">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-fg">
            <ShieldCheck className="h-4 w-4 text-primary-hover" /> Permission summary
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <section key={group.featureId} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-fg">{group.name}</h4>
                  <Badge tone="neutral">{group.permissions.length}</Badge>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-fg-secondary">
                  {group.permissions.map((permission) => <li key={permission.id}>{permission.name}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse justify-center gap-3 border-t border-border pt-5 sm:flex-row">
          <Link to="/roles" className={buttonStyles('secondary', 'md')}>Back to Roles</Link>
          <Link to="/create-role" className={buttonStyles('primary', 'md')}>Create Another Role</Link>
        </div>
      </Card>
    </div>
  )
}
