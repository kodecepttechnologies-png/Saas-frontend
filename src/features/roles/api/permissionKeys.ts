export const permissionKeys = {
  all: ['permissions'] as const,
  list: () => [...permissionKeys.all, 'list'] as const,
  byFeature: (featureId: string) => [...permissionKeys.all, 'feature', featureId] as const,
}
