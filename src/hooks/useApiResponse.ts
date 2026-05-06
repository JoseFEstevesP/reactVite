import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import type { AxiosError } from 'axios';
import { useToast } from './useToast';

interface UseApiResponseReturn {
	handleSuccess: <T>(
		response: ApiResponse<T> | undefined,
		fallbackMessage?: string,
	) => boolean;
	handleError: (
		error: AxiosError<ApiErrorResponse> | unknown,
		setFormErrors?: (field: string, message: string) => void,
	) => boolean;
	getFieldError: (
		error: AxiosError<ApiErrorResponse> | unknown,
		field: string,
	) => string | undefined;
}

export function useApiResponse(): UseApiResponseReturn {
	const { success: toastSuccess, error: toastError } = useToast();

	const handleSuccess = <T>(
		response: ApiResponse<T> | undefined,
		fallbackMessage?: string,
	): boolean => {
		if (response?.success) {
			const message =
				(response.data as { msg?: string })?.msg ||
				response.message ||
				fallbackMessage;
			if (message) {
				toastSuccess(message);
			}
			return true;
		}
		return false;
	};

	const isError = (
		error: AxiosError<ApiErrorResponse> | unknown,
	): error is AxiosError<ApiErrorResponse> => {
		return (
			typeof error === 'object' &&
			error !== null &&
			'response' in error &&
			(error as AxiosError<ApiErrorResponse>).response?.data?.success === false
		);
	};

	const handleError = (
		error: AxiosError<ApiErrorResponse> | unknown,
		setFormErrors?: (field: string, message: string) => void,
	): boolean => {
		if (!isError(error)) return false;

		const errorData = error.response?.data;
		if (!errorData?.error?.details?.length) {
			if (errorData?.error?.message) {
				toastError(errorData.error.message);
			}
			return true;
		}

		let hasGlobalError = false;

		for (const detail of errorData.error.details) {
			if (detail.field === 'all') {
				toastError(detail.message);
				hasGlobalError = true;
			} else if (setFormErrors) {
				setFormErrors(detail.field, detail.message);
			}
		}

		if (!hasGlobalError && !setFormErrors) {
			toastError(errorData.error.message);
		}

		return hasGlobalError;
	};

	const getFieldError = (
		error: AxiosError<ApiErrorResponse> | unknown,
		field: string,
	): string | undefined => {
		if (!isError(error)) return undefined;

		const errorData = error.response?.data;
		return errorData?.error?.details?.find(d => d.field === field)?.message;
	};

	return { handleSuccess, handleError, getFieldError };
}
