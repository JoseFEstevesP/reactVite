import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import http from '../http';
import type { RequestConfig } from '../types';

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
	onError?: (message: string) => void;
}

export function useGet<TData>(url: string, options: UseGetOptions = {}) {
	const {
		queryKey,
		config,
		staleTime = 1000 * 60 * 5,
		gcTime = 1000 * 60 * 10,
		enabled = true,
		retry = 2,
		retryDelay,
		refetchOnWindowFocus = false,
		refetchOnMount = false,
		onError,
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

	useEffect(() => {
		if (result.isError && onError) {
			const err = result.error as Error & { _customMessage?: string };
			onError(err._customMessage || err.message || 'Error en la solicitud');
		}
	}, [result.isError, result.error, onError]);

	return {
		data: result.data,
		isFetching: result.isFetching,
		isPending: result.isPending,
		isLoading: result.isLoading,
		isError: result.isError,
		status: result.status,
		error: result.error as Error,
		refetch: result.refetch,
	};
}
