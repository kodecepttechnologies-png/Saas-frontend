import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().trim().min(1, 'Role name is required').max(100, 'Role name must be 100 characters or fewer'),
  priority: z.string().max(30, 'Priority must be 30 characters or fewer'),
  description: z.string().optional(),
  isSystemRole: z.boolean(),
  permissionIds: z.array(z.string()).min(1, 'Select at least one permission for this role.').refine(
    (ids) => new Set(ids).size === ids.length,
    'A permission can only be selected once.',
  ),
})

export type RoleFormValues = z.infer<typeof roleSchema>
