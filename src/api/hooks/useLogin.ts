import { useAuthStore } from '@/stores/authStore';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginDTOTypes } from '@/components/login/dto/LoginDTO';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { routes } from '../url';
import { usePost } from './usePost';

export function useLogin() {
	const { setToken } = useAuthStore();
	const navigate = useNavigate();
	const { handleSuccess, handleError } = useApiResponse();

	const login = usePost<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		LoginDTOTypes
	>(routes.login, {
		queryKey: ['login'],
		onSuccess: data => {
			if (handleSuccess(data)) {
				setToken(crypto.randomUUID());
				navigate('/');
			}
		},
		onError: error => {
			handleError(error);
		},
	});
	const handleLogin = useCallback(async (data: LoginDTOTypes) => {
		await login.mutateAsync(data);
	}, []);

	return {
		handleLogin,
	};
}
