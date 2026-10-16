import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Alert } from '@/components/feedback/Alert'
import { Badge, Button, Card, Checkbox, Input, PageHeader } from '@/components/ui'
import { groupPermissions } from '../utils/permissionGrouping'
import type { Permission } from '../types/permission.types'
import { roleSchema, type RoleFormValues } from '../schemas/role.schemas'

interface RoleWizardProps {
  permissions: Permission[]
  permissionsLoading: boolean
  permissionsError?: string
  previewMode: boolean
  isPending: boolean
  submitError?: string
  onSubmit: (values: RoleFormValues, permissions: Permission[]) => Promise<void>
  organizationAvailable: boolean
}

function SelectAllCheckbox({
  label,
  checked,
  indeterminate,
  onChange,
}: {
  label: string
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-fg">
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border accent-primary-hover"
      />
      {label}
    </label>
  )
}

export function RoleWizard({
  permissions,
  permissionsLoading,
  permissionsError,
  previewMode,
  isPending,
  submitError,
  onSubmit,
  organizationAvailable,
}: RoleWizardProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const groups = useMemo(() => groupPermissions(permissions), [permissions])
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      priority: 'medium',
      description: '',
      isSystemRole: false,
      permissionIds: [],
    },
  })
  const selectedIds = watch('permissionIds')
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const selectedCount = permissions.reduce(
    (count, permission) => count + (selectedSet.has(permission.id) ? 1 : 0),
    0,
  )

  const togglePermission = (permissionId: string) => {
    const next = new Set(selectedSet)
    if (next.has(permissionId)) next.delete(permissionId)
    else next.add(permissionId)
    setValue('permissionIds', [...next], { shouldDirty: true, shouldValidate: step === 2 })
  }

  const toggleGroup = (groupPermissions: Permission[]) => {
    const ids = groupPermissions.map((permission) => permission.id)
    const groupSelected = ids.every((id) => selectedSet.has(id))
    const next = new Set(selectedSet)
    ids.forEach((id) => groupSelected ? next.delete(id) : next.add(id))
    setValue('permissionIds', [...next], { shouldDirty: true, shouldValidate: step === 2 })
  }

  const allSelected = permissions.length > 0 && selectedCount === permissions.length
  const someSelected = selectedCount > 0 && !allSelected

  const goToPermissions = async () => {
    const valid = await trigger(['name', 'priority', 'description'])
    if (valid) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submit = handleSubmit(async (values) => {
    const uniqueIds = [...new Set(values.permissionIds)]
    const selectedPermissions = permissions.filter((permission) => uniqueIds.includes(permission.id))
    await onSubmit(
      { ...values, permissionIds: selectedPermissions.map((permission) => permission.id) },
      selectedPermissions,
    )
  })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Create Role"
        description="Define the role and choose exactly what employees assigned to it can access."
      />

      {previewMode && (
        <Alert tone="info">
          <strong>Preview Mode.</strong> Organization context is not connected. You can explore the role setup, but creating a production role requires an organization.
        </Alert>
      )}

      <ol className="grid grid-cols-2 gap-3" aria-label="Role creation steps">
        {[
          { id: 1, label: 'Basic Information' },
          { id: 2, label: 'Permissions & Access' },
        ].map((item) => (
          <li
            key={item.id}
            aria-current={step === item.id ? 'step' : undefined}
            className={`flex items-center gap-3 rounded-xl border p-3 sm:p-4 ${
              step === item.id ? 'border-primary/40 bg-primary/5' : 'border-border bg-surface'
            }`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              step === item.id ? 'bg-primary text-white' : 'bg-surface-secondary text-fg-muted'
            }`}>
              {step > item.id ? <Check className="h-4 w-4" /> : item.id}
            </span>
            <span className="text-sm font-semibold text-fg">{item.label}</span>
          </li>
        ))}
      </ol>

      {submitError && <Alert tone="error">{submitError}</Alert>}

      {step === 1 ? (
        <Card className="space-y-6 p-5 sm:p-8">
          <div className="flex items-start gap-3 border-b border-border pb-5">
            <span className="rounded-xl bg-primary/10 p-2.5 text-primary-hover"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <h2 className="font-bold text-fg">Basic Information</h2>
              <p className="mt-1 text-sm text-fg-muted">Set the role name, responsibility level, and purpose.</p>
            </div>
          </div>
          <Input
            label="Role Name"
            placeholder="e.g. HR Manager"
            maxLength={100}
            error={errors.name?.message}
            {...register('name')}
          />
          <div>
            <label htmlFor="role-priority" className="mb-1.5 block text-sm font-medium text-fg-secondary">Priority</label>
            <select
              id="role-priority"
              className="min-h-11 w-full rounded-lg border border-border bg-surface-secondary px-3.5 text-base text-fg sm:text-sm"
              {...register('priority')}
            >
              <option value="">No priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority?.message && <p className="mt-1 text-sm text-danger">{errors.priority.message}</p>}
            <p className="mt-1.5 text-sm text-fg-muted">Priority describes responsibility level. It does not grant permissions.</p>
          </div>
          <div>
            <label htmlFor="role-description" className="mb-1.5 block text-sm font-medium text-fg-secondary">Description <span className="font-normal text-fg-muted">(optional)</span></label>
            <textarea
              id="role-description"
              rows={4}
              placeholder="Describe the responsibilities of this role"
              className="w-full resize-y rounded-lg border border-border bg-surface-secondary px-3.5 py-3 text-base text-fg placeholder:text-fg-muted focus:border-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-hover/20 sm:text-sm"
              {...register('description')}
            />
          </div>
          <div className="rounded-xl border border-border bg-surface-secondary/40 p-4">
            <Checkbox
              label={<span><strong className="block text-fg">System Role</strong><span className="mt-0.5 block text-sm text-fg-muted">System roles are predefined or protected. Leave off for normal custom roles.</span></span>}
              {...register('isSystemRole')}
            />
          </div>
          <div className="flex justify-end border-t border-border pt-5">
            <Button onClick={goToPermissions} className="w-full sm:w-auto">
              Continue to permissions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <Card className="space-y-5 p-5 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-fg">Permissions &amp; Access</h2>
                <p className="mt-1 text-sm text-fg-muted">Choose exactly what employees assigned to this role can access.</p>
              </div>
              <Badge tone="primary">{selectedCount} / {permissions.length} selected</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-secondary/60 p-3">
              <span className="text-sm text-fg-secondary">{permissions.length} permissions available</span>
              <SelectAllCheckbox
                label="Select All Permissions"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={() => {
                  setValue(
                    'permissionIds',
                    allSelected ? [] : permissions.map((permission) => permission.id),
                    { shouldDirty: true, shouldValidate: true },
                  )
                }}
              />
            </div>

            {errors.permissionIds?.message && (
              <p role="alert" className="text-sm font-medium text-danger">{errors.permissionIds.message}</p>
            )}

            {permissionsError && <Alert tone="error">{permissionsError}</Alert>}

            {permissionsLoading ? (
              <div className="grid gap-4 md:grid-cols-2" aria-label="Loading permissions">
                {[0, 1, 2, 3].map((key) => <div key={key} className="h-48 animate-pulse rounded-xl border border-border bg-surface-secondary/50" />)}
              </div>
            ) : permissions.length === 0 ? (
              <Alert tone="info">
                <strong>No permissions available.</strong> The administrator must configure permissions before creating access-controlled roles.
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {groups.map((group) => {
                  const count = group.permissions.filter((permission) => selectedSet.has(permission.id)).length
                  return (
                    <section key={group.featureId} className="rounded-xl border border-border bg-surface p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-fg">{group.name}</h3>
                          <p className="mt-1 text-xs text-fg-muted">{count} / {group.permissions.length} selected</p>
                        </div>
                        <SelectAllCheckbox
                          label="Select all"
                          checked={count === group.permissions.length}
                          indeterminate={count > 0 && count < group.permissions.length}
                          onChange={() => toggleGroup(group.permissions)}
                        />
                      </div>
                      <ul className="space-y-1 border-t border-border pt-2">
                        {group.permissions.map((permission) => (
                          <li key={permission.id}>
                            <Checkbox
                              label={<span>{permission.name}{permission.description && <span className="mt-0.5 block text-xs text-fg-muted">{permission.description}</span>}</span>}
                              checked={selectedSet.has(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
                })}
              </div>
            )}

            {!organizationAvailable && (
              <Alert tone="info">Creating a production role is unavailable until an organization is connected. No role request will be sent.</Alert>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" onClick={() => setStep(1)} disabled={isPending}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="submit"
                loading={isPending}
                disabled={isPending || permissionsLoading || permissions.length === 0 || !organizationAvailable}
                className="w-full sm:w-auto"
              >
                {isPending ? 'Creating Role...' : 'Create Role'}
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}
