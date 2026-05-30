import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from '@/components/modal/hooks/useModal';

describe('useModal', () => {
	it('starts closed', () => {
		const { result } = renderHook(() => useModal());
		expect(result.current.isOpen).toBe(false);
	});

	it('opens when handleOpen is called', () => {
		const { result } = renderHook(() => useModal());
		act(() => result.current.handleOpen());
		expect(result.current.isOpen).toBe(true);
	});

	it('closes when handleClose is called after opening', () => {
		const { result } = renderHook(() => useModal());
		act(() => result.current.handleOpen());
		expect(result.current.isOpen).toBe(true);
		act(() => result.current.handleClose());
		expect(result.current.isOpen).toBe(false);
	});
});
