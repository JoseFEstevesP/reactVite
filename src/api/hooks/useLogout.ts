import { useAuthStore } from '@/stores/authStore';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import http from '../http';
import { routes } from '../url';
import { useToast } from '@/hooks/useToast';

export function useLogout() {
	const navigate = useNavigate();
	const { setToken } = useAuthStore();
	const { success: showSuccess, error: showError } = useToast();

	const clearSession = () => {
		sessionStorage.removeItem('miniToken');
		setToken(null);
		navigate('/login');
	};

	const mutation = useMutation({
		mutationFn: () => http.post(routes.logout),
		onSuccess: () => {
			showSuccess('Sesión cerrada exitosamente');
			clearSession();
		},
		onError: err => {
			const axiosErr = err as AxiosError;
			const status = axiosErr.response?.status;
			if (status === 401) {
				clearSession();
			} else {
				showError('Error al cerrar sesión');
				clearSession();
			}
		},
	});

	return {
		...mutation,
	};
}
