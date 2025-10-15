interface QueryKeysConfig {
  entity: string;
}

export const createQueryKeys = ({ entity }: QueryKeysConfig) => ({
  all: [entity] as const,
  lists: () => [entity, 'list'] as const,
  list: (filters: Record<string, any>) => [entity, 'list', filters] as const,
  details: () => [entity, 'detail'] as const,
  detail: (id: string | number) => [entity, 'detail', id] as const,
});
