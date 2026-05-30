import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
	beforeEach(() => {
		sessionStorage.clear();
		useAuthStore.setState({ token: null, isInitialized: false });
	});

	it('starts with null token and not initialized', () => {
		const state = useAuthStore.getState();
		expect(state.token).toBeNull();
		expect(state.isInitialized).toBe(false);
	});

	it('setToken stores token in sessionStorage', () => {
		useAuthStore.getState().setToken('test-token');
		expect(useAuthStore.getState().token).toBe('test-token');
		expect(sessionStorage.getItem('miniToken')).toBe('test-token');
	});

	it('setToken removes token from sessionStorage when null', () => {
		sessionStorage.setItem('miniToken', 'existing');
		useAuthStore.getState().setToken(null);
		expect(useAuthStore.getState().token).toBeNull();
		expect(sessionStorage.getItem('miniToken')).toBeNull();
	});

	it('initialize reads token from sessionStorage', async () => {
		sessionStorage.setItem('miniToken', 'stored-token');
		await useAuthStore.getState().initialize();
		const state = useAuthStore.getState();
		expect(state.token).toBe('stored-token');
		expect(state.isInitialized).toBe(true);
	});

	it('initialize calls onRolReady when encryptedRol exists', async () => {
		sessionStorage.setItem('miniToken', 'token');
		sessionStorage.setItem('encryptedRol', 'rol-data');
		const onRolReady = vi.fn();
		await useAuthStore.getState().initialize(onRolReady);
		expect(onRolReady).toHaveBeenCalledWith('rol-data');
	});
});

describe('authStore - http integration', () => {
	beforeEach(() => {
		sessionStorage.clear();
		useAuthStore.setState({ token: null, isInitialized: false });
	});

	it('initialize sets initialized on http error', async () => {
		await useAuthStore.getState().initialize();
		const state = useAuthStore.getState();
		expect(state.isInitialized).toBe(true);
		expect(state.token).toBeNull();
	});
});
