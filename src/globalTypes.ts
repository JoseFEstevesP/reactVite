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

export interface Role {
	uid: string;
	name: string;
	description: string;
	permissions: string[];
	status: boolean;
}

export interface RolesResponse {
	rows: Role[];
	count: number;
	currentPage: number;
	nextPage: number | null;
	previousPage: number | null;
	limit: number;
	pages: number;
}

export interface ApiResponseGeneric<T> {
	success: boolean;
	data: T;
	message?: string;
}

export type RolesApiResponse = ApiResponseGeneric<RolesResponse>;
