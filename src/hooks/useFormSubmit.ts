import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import { useApiMutation } from '@/api/hooks/useApiMutation';
import { useApiResponse } from '@/hooks/useApiResponse';

interface UseFormSubmitOptions {
	url: string;
	method: 'post' | 'patch';
	queryKey?: string[];
	navigateTo: string;
}

interface SubmitOptions {
	onSuccess?: () => void;
	onError?: (field: string, message: string) => void;
}

export function useFormSubmit<TPayload>({
	url,
	method,
	queryKey,
	navigateTo,
}: UseFormSubmitOptions) {
	const navigate = useNavigate();
	const { handleSuccess, handleError } = useApiResponse();

	const { mutate, isPending } = useApiMutation<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		TPayload
	>(url, method, { queryKey });

	const submit = useCallback(
		(payload: TPayload, options?: SubmitOptions) => {
			mutate(payload, {
				onSuccess: res => {
					handleSuccess(res);
					options?.onSuccess?.();
					navigate(navigateTo);
				},
				onError: err => {
					if (options?.onError) {
						handleError(err, options.onError);
					}
				},
			});
		},
		[mutate, handleSuccess, handleError, navigate, navigateTo],
	);

	return { submit, isPending };
}
