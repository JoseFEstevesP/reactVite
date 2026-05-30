import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore, toastSuccess, toastError } from './toastStore';

describe('toastStore', () => {
	beforeEach(() => {
		useToastStore.setState({ toasts: [] });
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('adds a toast', () => {
		useToastStore.getState().addToast({ message: 'Test', type: 'success' });
		const { toasts } = useToastStore.getState();
		expect(toasts).toHaveLength(1);
		expect(toasts[0].message).toBe('Test');
		expect(toasts[0].type).toBe('success');
	});

	it('limits toasts to 3', () => {
		for (let i = 0; i < 5; i++) {
			useToastStore.getState().addToast({ message: `Toast ${i}`, type: 'success' });
		}
		const { toasts } = useToastStore.getState();
		expect(toasts).toHaveLength(3);
	});

	it('removes toast after duration', () => {
		useToastStore.getState().addToast({ message: 'Auto-dismiss', type: 'success', duration: 1000 });
		expect(useToastStore.getState().toasts).toHaveLength(1);
		vi.advanceTimersByTime(1000);
		expect(useToastStore.getState().toasts).toHaveLength(0);
	});

	it('removes toast by id', () => {
		useToastStore.getState().addToast({ message: 'Manual', type: 'error' });
		const id = useToastStore.getState().toasts[0].id;
		useToastStore.getState().removeToast(id);
		expect(useToastStore.getState().toasts).toHaveLength(0);
	});

	it('toastSuccess adds a success toast', () => {
		toastSuccess('Success!');
		expect(useToastStore.getState().toasts).toHaveLength(1);
		expect(useToastStore.getState().toasts[0].type).toBe('success');
	});

	it('toastError adds an error toast', () => {
		toastError('Error!');
		expect(useToastStore.getState().toasts).toHaveLength(1);
		expect(useToastStore.getState().toasts[0].type).toBe('error');
	});
});
