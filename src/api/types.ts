import type { ApiErrorResponse } from '@/globalTypes';

export interface ApiResponse<TData> {
	success: boolean;
	data: TData;
	message?: string;
}

export type ApiError = ApiErrorResponse['error'];

export interface RequestConfig {
	params?: Record<string, string | number | boolean>;
	headers?: Record<string, string>;
}
