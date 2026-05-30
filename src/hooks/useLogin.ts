import { useAuthStore } from '@/stores/authStore';
import { useRolStore } from '@/stores/rolStore';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginDTOTypes } from '@/components/login/dto/LoginDTO';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { useApiMutation } from '@/api/hooks/useApiMutation';
import { routes } from '@/api/url';

export function useLogin() {
	const { setToken } = useAuthStore();
	const { setEncryptedRol } = useRolStore();
	const navigate = useNavigate();
	const { handleSuccess, handleError } = useApiResponse();

	const login = useApiMutation<
		ApiResponse<{ msg: string; rol: string }>,
		AxiosError<ApiErrorResponse>,
		LoginDTOTypes
	>(routes.login, 'post', {
		queryKey: ['login'],
		onSuccess: data => {
			if (handleSuccess(data)) {
				setToken(crypto.randomUUID());
				setEncryptedRol(data.data.rol);
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
