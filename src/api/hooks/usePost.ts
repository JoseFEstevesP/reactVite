import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from '@tanstack/react-query';
import http from '../http';

export type UsePostState<TData, TError = Error> =
	| { status: 'pending' }
	| { status: 'loading' }
	| { status: 'success'; data: TData }
	| { status: 'error'; error: TError };

interface UsePostOptions<TData, TError> {
	queryKey?: string[];
	onSuccess?: (data: TData) => void;
	onError?: (error: TError) => void;
	retry?: number;
}

export function usePost<TData, TError, TPayload = unknown>(
	url: string,
	options: UsePostOptions<TData, TError> = {},
): UsePostState<TData, TError> &
	Pick<
		UseMutationResult<TData, TError, TPayload>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	> {
	const { queryKey, onSuccess, onError, retry } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation<TData, TError, TPayload>({
		mutationFn: async payload => {
			const response = await http.post<TData>(url, payload);
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
