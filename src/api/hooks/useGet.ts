import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import http from '../http';
import type { RequestConfig } from '../types';

export type UseGetState<TData, TError = Error> =
	| { status: 'pending' }
	| { status: 'loading' }
	| { status: 'success'; data: TData }
	| { status: 'error'; error: TError };

interface UseGetOptions {
	queryKey?: string[];
	config?: RequestConfig;
	staleTime?: number;
	gcTime?: number;
	enabled?: boolean;
	retry?: number | false;
	retryDelay?: number;
	refetchOnWindowFocus?: boolean;
	refetchOnMount?: boolean;
}

export function useGet<TData>(
	url: string,
	options: UseGetOptions = {},
): UseGetState<TData> & Pick<UseQueryResult<TData>, 'isFetching' | 'refetch'> {
	const {
		queryKey,
		config,
		staleTime = 1000 * 60 * 5,
		gcTime = 1000 * 60 * 10,
		enabled = true,
		retry = 3,
		retryDelay,
		refetchOnWindowFocus = false,
		refetchOnMount = false,
	} = options;

	const result = useQuery<TData>({
		queryKey: queryKey ?? [url, config?.params],
		queryFn: async () => {
			const response = await http.get<TData>(url, config);
			return response.data;
		},
		staleTime,
		gcTime,
		enabled,
		retry,
		retryDelay,
		refetchOnWindowFocus,
		refetchOnMount,
	});

	const state = (() => {
		if (result.isPending) return { status: 'pending' as const };
		if (result.isLoading) return { status: 'loading' as const };
		if (result.isError)
			return { status: 'error' as const, error: result.error as Error };
		return { status: 'success' as const, data: result.data as TData };
	})();

	return {
		...state,
		isFetching: result.isFetching,
		refetch: result.refetch,
	};
}
