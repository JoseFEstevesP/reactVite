import { create } from 'zustand';

interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error';
	duration?: number;
}

interface ToastState {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, 'id'>) => void;
	removeToast: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const toastStoreBase = create<ToastState>((set, get) => ({
	toasts: [],
	addToast: toast => {
		const id = generateId();
		const newToast = { ...toast, id };

		const state = get();
		const updatedToasts = [...state.toasts, newToast];
		if (updatedToasts.length > 3) {
			updatedToasts.shift();
		}
		set({ toasts: updatedToasts });

		const duration = toast.duration ?? 4000;
		setTimeout(() => {
			set(s => ({
				toasts: s.toasts.filter(t => t.id !== id),
			}));
		}, duration);
	},
	removeToast: id => {
		set(state => ({
			toasts: state.toasts.filter(t => t.id !== id),
		}));
	},
}));

export const useToastStore = toastStoreBase;

export const toastSuccess = (message: string, duration?: number) => {
	toastStoreBase.getState().addToast({ message, type: 'success', duration });
};

export const toastError = (message: string, duration?: number) => {
	toastStoreBase.getState().addToast({ message, type: 'error', duration });
};
