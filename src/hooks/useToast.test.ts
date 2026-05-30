import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from './useToast';

const mockAddToast = vi.fn();
vi.mock('@/stores/toastStore', () => ({
	useToastStore: () => ({ addToast: mockAddToast }),
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
}));

describe('useToast', () => {
	it('success calls addToast with success type', () => {
		const { result } = renderHook(() => useToast());
		result.current.success('Success message');
		expect(mockAddToast).toHaveBeenCalledWith({
			message: 'Success message',
			type: 'success',
			duration: undefined,
		});
	});

	it('error calls addToast with error type', () => {
		const { result } = renderHook(() => useToast());
		result.current.error('Error message');
		expect(mockAddToast).toHaveBeenCalledWith({
			message: 'Error message',
			type: 'error',
			duration: undefined,
		});
	});

	it('success passes custom duration', () => {
		const { result } = renderHook(() => useToast());
		result.current.success('Persistent', { duration: 8000 });
		expect(mockAddToast).toHaveBeenCalledWith({
			message: 'Persistent',
			type: 'success',
			duration: 8000,
		});
	});
});
