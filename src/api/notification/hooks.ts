import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routes } from '@/api/url';
import http from '@/api/http';
import type { ApiResponse } from '@/api/types';
import type { NotificationResponse } from './types';

export function useNotifications() {
	return useQuery<ApiResponse<NotificationResponse[]>>({
		queryKey: ['notifications'],
		queryFn: async () => {
			const response = await http.get<ApiResponse<NotificationResponse[]>>(
				routes.notification.all,
			);
			return response.data;
		},
		refetchInterval: 1000 * 60 * 60,
		staleTime: 1000 * 60 * 5,
	});
}

export function useMarkAsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (uid: string) => {
			const url = routes.notification.read.replace(':uid', uid);
			await http.post(url);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});
}
