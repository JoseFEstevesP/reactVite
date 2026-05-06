import { useToastStore, toastSuccess, toastError } from '@/stores/toastStore';

export const useToast = () => {
	const { addToast } = useToastStore();

	const success = (message: string, options?: { duration?: number }) => {
		addToast({ message, type: 'success', duration: options?.duration });
	};

	const error = (message: string, options?: { duration?: number }) => {
		addToast({ message, type: 'error', duration: options?.duration });
	};

	return { success, error };
};

export { toastSuccess, toastError };
