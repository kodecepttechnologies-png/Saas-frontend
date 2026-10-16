import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ShieldCheck } from 'lucide-react'
import { Alert } from '@/components/feedback/Alert'
import { Badge, buttonStyles, Card, Input, PageHeader, Spinner } from '@/components/ui'
import { useOrganization } from '@/hooks/useOrganization'
import { useRoles, useRoleSearch } from '../hooks/useRoles'
import type { Role } from '../types/role.types'

const EMPTY_ROLES: Role[] = []

function formatDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

function priorityTone(priority?: string): 'neutral' | 'primary' | 'success' | 'warning' {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return 'warning'
    case 'high':
      return 'primary'
    case 'medium':
      return 'success'
    default:
      return 'neutral'
  }
}

function permissionCount(role: Role): number {
  return role.permissionIds?.length ?? role.permissions?.length ?? 0
}

export function RolesPage() {
  const { organizationId } = useOrganization()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [priority, setPriority] = useState('all')
  const [roleType, setRoleType] = useState('all')
  const rolesQuery = useRoles(organizationId)
  const searchQuery = useRoleSearch(organizationId, debouncedSearch)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  const source = debouncedSearch ? searchQuery : rolesQuery
  const roles = source.data ?? EMPTY_ROLES
  const filteredRoles = useMemo(() => roles.filter((role) => {
    const matchesPriority = priority === 'all' || role.priority?.toLowerCase() === priority
    const matchesType = roleType === 'all' ||
      (roleType === 'system' ? role.isSystemRole : !role.isSystemRole)
    const matchesSearch = debouncedSearch
      ? role.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true
    return matchesPriority && matchesType && matchesSearch
  }), [roles, priority, roleType, debouncedSearch])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Role Management"
          description="Create and manage roles and control what employees can access."
        />
        <Link to="/create-role" className={buttonStyles('primary', 'md', 'shrink-0')}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          Create Role
        </Link>
      </div>

      {!organizationId && (
        <Alert tone="info">
          <strong>Preview Mode.</strong> Organization context is not connected. You can explore Role Management, but production roles require an organization.
        </Alert>
      )}

      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
            <Input
              label="Search roles"
              placeholder="Search roles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <div>
            <label htmlFor="priority-filter" className="mb-1.5 block text-sm font-medium text-fg-secondary">Priority</label>
            <select
              id="priority-filter"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-border bg-surface-secondary px-3 text-sm text-fg"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="role-type-filter" className="mb-1.5 block text-sm font-medium text-fg-secondary">Role type</label>
            <select
              id="role-type-filter"
              value={roleType}
              onChange={(event) => setRoleType(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-border bg-surface-secondary px-3 text-sm text-fg"
            >
              <option value="all">All types</option>
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {source.isError && (
          <Alert tone="error">{source.error?.message ?? 'Unable to load roles. Please try again.'}</Alert>
        )}

        {source.isLoading ? (
          <div className="space-y-3 py-4" aria-label="Loading roles">
            {[0, 1, 2].map((row) => <div key={row} className="h-14 animate-pulse rounded-lg bg-surface-secondary" />)}
          </div>
        ) : source.isError ? null : filteredRoles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center">
            <ShieldCheck aria-hidden="true" className="mx-auto h-9 w-9 text-fg-muted" />
            <h2 className="mt-3 font-semibold text-fg">{debouncedSearch ? 'No roles found' : 'No roles yet'}</h2>
            <p className="mt-1 text-sm text-fg-muted">
              {debouncedSearch ? 'Try a different search term or adjust your filters.' : 'Create a role to define a specific set of employee permissions.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-fg-muted">
                  <th className="px-3 py-3 font-semibold">Role Name</th>
                  <th className="px-3 py-3 font-semibold">Priority</th>
                  <th className="px-3 py-3 font-semibold">Description</th>
                  <th className="px-3 py-3 font-semibold">Permissions</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Created</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRoles.map((role) => (
                  <tr key={role.id || role.name} className="align-top">
                    <td className="px-3 py-4 font-semibold text-fg">{role.name}</td>
                    <td className="px-3 py-4">
                      {role.priority ? <Badge tone={priorityTone(role.priority)}>{role.priority}</Badge> : '—'}
                    </td>
                    <td className="max-w-xs px-3 py-4 text-fg-secondary">{role.description || '—'}</td>
                    <td className="px-3 py-4 text-fg-secondary">{permissionCount(role)} permissions</td>
                    <td className="px-3 py-4">
                      <Badge tone={role.isSystemRole ? 'neutral' : 'primary'}>{role.isSystemRole ? 'System Role' : 'Custom Role'}</Badge>
                    </td>
                    <td className="px-3 py-4 text-fg-muted">{formatDate(role.createdAt)}</td>
                    <td className="px-3 py-4 text-fg-muted">
                      <span aria-label="Role detail actions are not available yet">—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {source.isFetching && !source.isLoading && (
          <span className="inline-flex items-center gap-2 text-xs text-fg-muted"><Spinner label="" className="h-3.5 w-3.5" /> Updating roles</span>
        )}
      </Card>
    </div>
  )
}
