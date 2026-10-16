export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (organizationId?: string) =>
    organizationId ? ([...roleKeys.lists(), organizationId] as const) : ([...roleKeys.lists()] as const),
  search: (organizationId: string | undefined, search: string) =>
    [...roleKeys.all, 'search', organizationId ?? '', search] as const,
}
