export interface ValueAll {
	value: string;
	label: string;
}

export interface ApiResponse<T> {
	success: true;
	data: T;
	message?: string;
}

export interface ApiErrorDetail {
	field: string;
	message: string;
}

export interface ApiErrorResponse {
	success: false;
	error: {
		code: number;
		name: string;
		message: string;
		details: ApiErrorDetail[];
	};
}

export type ApiErrorType = ApiErrorResponse['error'];
