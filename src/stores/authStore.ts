import http from '@/api/http';
import { routes } from '@/api/url';
import type { ApiErrorResponse } from '@/globalTypes';
import type { AxiosError } from 'axios';
import { create } from 'zustand';
import { toastError } from '@/hooks/useToast';

interface AuthState {
	token: string | null;
	isInitialized: boolean;
	setToken: (token: string | null) => void;
	initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
	token: null,
	isInitialized: false,

	setToken: token => {
		if (token) {
			sessionStorage.setItem('miniToken', token);
		} else {
			sessionStorage.removeItem('miniToken');
		}
		set({ token });
	},

	initialize: async () => {
		const storedToken = sessionStorage.getItem('miniToken');

		if (storedToken) {
			set({ token: storedToken, isInitialized: true });
			return;
		}

		try {
			const response = await http.get(routes.check);
			const isAuthenticated =
				response.data.success && response.data.data?.isAuthenticated;

			if (isAuthenticated) {
				const newToken = crypto.randomUUID();
				sessionStorage.setItem('miniToken', newToken);
				set({ token: newToken, isInitialized: true });
			} else {
				set({ token: null, isInitialized: true });
			}
		} catch (error) {
			const e = error as AxiosError<ApiErrorResponse>;
			const message =
				e.response?.data?.error?.message ||
				e.response?.data?.error?.details?.[0]?.message;
			if (message) {
				toastError(message);
			}
			set({ token: null, isInitialized: true });
		}
	},
}));
