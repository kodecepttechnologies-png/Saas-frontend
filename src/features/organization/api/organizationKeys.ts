export const organizationKeys = {
  all: ['organization'] as const,
  current: (userId?: string) => [...organizationKeys.all, 'current', userId ?? 'anonymous'] as const,
}