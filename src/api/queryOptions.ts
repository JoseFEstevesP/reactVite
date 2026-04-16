import { queryOptions } from '@tanstack/react-query'

export { queryOptions }

export function createQueryOptions<TQueryKey extends string[], TData>(config: {
  queryKey: TQueryKey
  queryFn: () => Promise<TData>
  staleTime?: number
}) {
  return queryOptions({
    queryKey: config.queryKey,
    queryFn: config.queryFn,
    staleTime: config.staleTime ?? 1000 * 60 * 5,
  })
}
