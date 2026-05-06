export interface ApiError {
	message: Record<string, { message: string }> | string;
}

export interface RequestConfig {
	params?: Record<string, string | number | boolean>;
	headers?: Record<string, string>;
}
