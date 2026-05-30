import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useApiResponse } from './useApiResponse';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import type { AxiosError } from 'axios';

vi.mock('@/stores/toastStore', () => ({
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
	useToastStore: () => ({
		addToast: vi.fn(),
	}),
}));

describe('useApiResponse', () => {
	let hook: ReturnType<typeof useApiResponse>;

	beforeEach(() => {
		const { result } = renderHook(() => useApiResponse());
		hook = result.current;
		vi.clearAllMocks();
	});

	describe('handleSuccess', () => {
		it('returns true and does not toast when response is successful without message', () => {
			const response: ApiResponse<{ msg: string }> = {
				success: true,
				data: { msg: '' },
			};
			const result = hook.handleSuccess(response);
			expect(result).toBe(true);
		});

		it('returns false when response is undefined', () => {
			const result = hook.handleSuccess(undefined);
			expect(result).toBe(false);
		});
	});

	describe('handleError', () => {
		const createAxiosError = (overrides: Partial<AxiosError<ApiErrorResponse>> = {}): AxiosError<ApiErrorResponse> => ({
			isAxiosError: true,
			name: 'AxiosError',
			message: 'Request failed',
			toJSON: () => ({}),
			...overrides,
		}) as AxiosError<ApiErrorResponse>;

		it('returns false for non-axios errors', () => {
			const result = hook.handleError(new Error('Generic error'));
			expect(result).toBe(false);
		});

		it('handles error with field-level details and calls setFormErrors', () => {
			const error = createAxiosError({
				response: {
					data: {
						success: false,
						error: {
							code: 400,
							name: 'ValidationError',
							message: 'Validation failed',
							details: [{ field: 'email', message: 'Email already exists' }],
						},
					},
					status: 400,
					statusText: 'Bad Request',
					headers: {},
					config: {} as never,
				},
			});
			const setFormErrors = vi.fn();
			const result = hook.handleError(error, setFormErrors);
			expect(result).toBe(false);
			expect(setFormErrors).toHaveBeenCalledWith('email', 'Email already exists');
		});
	});

	describe('getFieldError', () => {
		it('returns the error message for a specific field', () => {
			const error = {
				isAxiosError: true,
				name: 'AxiosError',
				message: 'Request failed',
				response: {
					data: {
						success: false,
						error: {
							code: 400,
							name: 'ValidationError',
							message: 'Validation failed',
							details: [{ field: 'email', message: 'Invalid email' }],
						},
					},
					status: 400,
					statusText: 'Bad Request',
					headers: {},
					config: {} as never,
				},
				toJSON: () => ({}),
			} as AxiosError<ApiErrorResponse>;

			const result = hook.getFieldError(error, 'email');
			expect(result).toBe('Invalid email');
		});

		it('returns undefined for non-axios errors', () => {
			const result = hook.getFieldError(new Error('test'), 'email');
			expect(result).toBeUndefined();
		});
	});
});
