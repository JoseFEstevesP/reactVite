import { toastError } from '@/stores/toastStore';
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
		if (result.isError) {
			const errorWithMessage = result.error as Error & {
				_customMessage?: string;
			};
			const errorMessage =
				errorWithMessage._customMessage ||
				result.error.message ||
				'Error en la solicitud';
			toastError(errorMessage);
		}
	}, [result.isError, result.error]);

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
