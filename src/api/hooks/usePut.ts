import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from '@tanstack/react-query';
import http from '../http';

export type UsePutState<TData, TError = Error> =
	| { status: 'pending' }
	| { status: 'loading' }
	| { status: 'success'; data: TData }
	| { status: 'error'; error: TError };

interface UsePutOptions {
	queryKey?: string[];
	onSuccess?: (data: unknown) => void;
	onError?: (error: Error) => void;
	retry?: number;
}

export function usePut<TData, TPayload = unknown>(
	url: string,
	options: UsePutOptions = {},
): UsePutState<TData> &
	Pick<
		UseMutationResult<TData, Error, TPayload>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	> {
	const { queryKey, onSuccess, onError, retry } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation<TData, Error, TPayload>({
		mutationFn: async payload => {
			const response = await http.put<TData>(url, payload);
			return response.data;
		},
		onSuccess: data => {
			if (queryKey) {
				queryClient.invalidateQueries({ queryKey });
			}
			onSuccess?.(data);
		},
		onError: error => {
			onError?.(error);
		},
		retry,
	});

	if (mutation.isPending) {
		return {
			status: 'loading',
			mutate: mutation.mutate,
			mutateAsync: mutation.mutateAsync,
			isPending: mutation.isPending,
			reset: mutation.reset,
		};
	}
	if (mutation.isSuccess) {
		return {
			status: 'success',
			data: mutation.data as TData,
			mutate: mutation.mutate,
			mutateAsync: mutation.mutateAsync,
			isPending: mutation.isPending,
			reset: mutation.reset,
		};
	}
	if (mutation.isError) {
		return {
			status: 'error',
			error: mutation.error as Error,
			mutate: mutation.mutate,
			mutateAsync: mutation.mutateAsync,
			isPending: mutation.isPending,
			reset: mutation.reset,
		};
	}
	return {
		status: 'pending',
		mutate: mutation.mutate,
		mutateAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
		reset: mutation.reset,
	};
}
