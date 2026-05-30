import {
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from '@tanstack/react-query';
import http from '../http';

type ApiMutationMethod = 'post' | 'patch' | 'delete';

type UseApiMutationState<TData, TError> =
	| { status: 'pending' }
	| { status: 'loading' }
	| { status: 'success'; data: TData }
	| { status: 'error'; error: TError };

interface UseApiMutationOptions<TData, TError> {
	queryKey?: string[];
	onSuccess?: (data: TData) => void;
	onError?: (error: TError) => void;
	retry?: number;
}

function buildState<TData, TError, TVariables>(
	mutation: UseMutationResult<TData, TError, TVariables>,
): UseApiMutationState<TData, TError> &
	Pick<
		UseMutationResult<TData, TError, TVariables>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	> {
	const shared = {
		mutate: mutation.mutate,
		mutateAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
		reset: mutation.reset,
	};
	if (mutation.isPending) return { status: 'loading', ...shared };
	if (mutation.isSuccess)
		return { status: 'success', data: mutation.data as TData, ...shared };
	if (mutation.isError)
		return { status: 'error', error: mutation.error as TError, ...shared };
	return { status: 'pending', ...shared };
}

export function useApiMutation<TData, TError, TPayload = unknown>(
	url: string,
	method: 'post' | 'patch',
	options?: UseApiMutationOptions<TData, TError>,
): UseApiMutationState<TData, TError> &
	Pick<
		UseMutationResult<TData, TError, TPayload>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	>;
export function useApiMutation<TData, TError>(
	url: string,
	method: 'delete',
	options?: UseApiMutationOptions<TData, TError>,
): UseApiMutationState<TData, TError> &
	Pick<
		UseMutationResult<TData, TError, string>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	>;
export function useApiMutation<TData, TError, TPayload = unknown>(
	url: string,
	method: ApiMutationMethod,
	options: UseApiMutationOptions<TData, TError> = {},
): UseApiMutationState<TData, TError> &
	Pick<
		UseMutationResult<TData, TError, TPayload>,
		'mutate' | 'mutateAsync' | 'isPending' | 'reset'
	> {
	const { queryKey, onSuccess, onError, retry } = options;
	const queryClient = useQueryClient();

	const mutation = useMutation<TData, TError, TPayload>({
		mutationFn: async payload => {
			if (method === 'delete') {
				const uid = payload as unknown as string;
				const finalUrl = url.replace(':uid', uid);
				const response = await http.delete(finalUrl);
				return response.data as TData;
			}
			const httpMethod = method === 'post' ? http.post : http.patch;
			const response = await httpMethod<TData>(url, payload);
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

	return buildState(mutation);
}
