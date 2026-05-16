import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/globalTypes';
import { useRolStore } from '@/stores/rolStore';
import { routes } from './url';

interface TokenExpiredResponse {
	expired: boolean;
	tokenType: 'access' | 'refresh';
	message: string;
}

interface CustomAxiosError extends AxiosError {
	_customMessage?: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
	_skipAuthInterceptor?: boolean;
}

const getErrorMessage = (error: AxiosError): string => {
	const data = error.response?.data as
		| ApiErrorResponse
		| TokenExpiredResponse
		| undefined;
	if (data) {
		if ('expired' in data && data.expired) {
			return data.message;
		}
		if ('error' in data && data.error?.message) {
			return data.error.message;
		}
		if ('message' in data && typeof data.message === 'string') {
			return data.message;
		}
	}
	return error.message || 'Error en la solicitud';
};

const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

const httpInternal = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(undefined);
		}
	});
	failedQueue = [];
};

http.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		const customError = error as CustomAxiosError;
		customError._customMessage = getErrorMessage(error);

		const originalRequest = error.config as CustomAxiosRequestConfig;

		const shouldSkip =
			originalRequest._skipAuthInterceptor ||
			originalRequest.url?.includes('refresh-token') ||
			originalRequest.url?.includes('logout') ||
			originalRequest.url?.includes('check-session');

		if (shouldSkip) {
			return Promise.reject(customError);
		}

		const errorData = error.response?.data as
			| ApiErrorResponse
			| TokenExpiredResponse
			| undefined;
		const isTokenExpired =
			errorData &&
			'expired' in errorData &&
			errorData.expired === true &&
			errorData.tokenType === 'access';

		const isRefreshRequest = originalRequest.url?.includes('refresh-token');
		const isLogoutRequest = originalRequest.url?.includes('logout');
		const isCheckSessionRequest =
			originalRequest.url?.includes('check-session');

		if (isTokenExpired && !originalRequest._retry && !isRefreshRequest) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => http(originalRequest))
					.catch(err => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await http.post(routes.refreshToken, {});
				processQueue(null);
				isRefreshing = false;
				return http(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				isRefreshing = false;

				const refreshErrorData = (refreshError as AxiosError).response?.data as
					| TokenExpiredResponse
					| undefined;
				const isRefreshExpired =
					refreshErrorData &&
					'expired' in refreshErrorData &&
					refreshErrorData.expired === true &&
					refreshErrorData.tokenType === 'refresh';

				const isRefreshUnauthorized =
					(refreshError as AxiosError).response?.status === 401;

				if (isRefreshExpired || isRefreshUnauthorized) {
					await handleSessionClosed();
				}

				return Promise.reject(refreshError);
			}
		}

		const isUnauthorized = error.response?.status === 401;

		if (
			isUnauthorized &&
			!isRefreshRequest &&
			!isLogoutRequest &&
			!isCheckSessionRequest &&
			!originalRequest._retry
		) {
			return handleUnauthorized(originalRequest, customError);
		}

		return Promise.reject(customError);
	},
);

	const handleUnauthorized = async (
	originalRequest: CustomAxiosRequestConfig,
	customError: CustomAxiosError,
) => {
	try {
		const checkResponse = await httpInternal.get(routes.check);

		const checkData = checkResponse.data?.data ?? {};
		const isSessionActive =
			checkResponse.data?.success && checkData.isAuthenticated;

		if (isSessionActive) {
			if (checkData.rol) {
				useRolStore.getState().setEncryptedRol(checkData.rol);
			}
			originalRequest._retry = true;

			try {
				await http.post(routes.refreshToken, {});
				return http(originalRequest);
			} catch (refreshErr) {
				const refreshErrData = (refreshErr as AxiosError).response?.data as
					| TokenExpiredResponse
					| undefined;
				const isRefreshExpired =
					refreshErrData &&
					'expired' in refreshErrData &&
					refreshErrData.expired === true &&
					refreshErrData.tokenType === 'refresh';

				const isRefreshUnauthorized =
					(refreshErr as AxiosError).response?.status === 401;

				if (isRefreshExpired || isRefreshUnauthorized) {
					await handleSessionClosed();
				}

				return Promise.reject(refreshErr);
			}
		}

		await handleSessionClosed();
		return Promise.reject(customError);
	} catch (checkErr) {
		await handleSessionClosed();
		return Promise.reject(checkErr);
	}
};

const handleSessionClosed = async () => {
	sessionStorage.removeItem('miniToken');
	useRolStore.getState().setEncryptedRol(null);
	try {
		await httpInternal.post(routes.logout, {});
	} catch {
		// Silently ignore logout error
	}
	window.location.href = '/login';
};

export default http;
