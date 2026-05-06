import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from '@tanstack/react-query';
import http from '../http';

export type UseDeleteState<TData = unknown, TError = Error> =
	| { status: 'pending' }
	| { status: 'loading' }
	| { status: 'success'; data: TData }
	| { status: 'error'; error: TError };

interface UseDeleteOptions<TData, TError> {
	queryKey?: string[];
	onSuccess?: (data: TData) => void;
	onError?: (error: TError) => void;
	retry?: number;
}

export function useDelete<TData = unknown, TError = Error>(
	url: string,
	options: UseDeleteOptions<TData, TError> = {},
): UseDeleteState<TData, TError> &
	Pick<
		UseMutationResult<TData, TError, string>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	> {
	const { queryKey, onSuccess, onError, retry } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation<TData, TError, string>({
		mutationFn: async (uid: string) => {
			const finalUrl = url.replace(':uid', uid);
			const response = await http.delete(finalUrl);
			return response.data as TData;
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
			error: mutation.error as TError,
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
