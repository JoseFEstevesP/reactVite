import { describe, expect, it, beforeEach } from 'vitest';
import { useRolStore } from './rolStore';

describe('rolStore', () => {
	beforeEach(() => {
		sessionStorage.clear();
		useRolStore.setState({ encryptedRol: null });
	});

	it('starts with null encryptedRol', () => {
		expect(useRolStore.getState().encryptedRol).toBeNull();
	});

	it('setEncryptedRol stores value', () => {
		useRolStore.getState().setEncryptedRol('encrypted-value');
		expect(useRolStore.getState().encryptedRol).toBe('encrypted-value');
		expect(sessionStorage.getItem('encryptedRol')).toBe('encrypted-value');
	});

	it('setEncryptedRol removes from sessionStorage when null', () => {
		sessionStorage.setItem('encryptedRol', 'existing');
		useRolStore.getState().setEncryptedRol(null);
		expect(useRolStore.getState().encryptedRol).toBeNull();
		expect(sessionStorage.getItem('encryptedRol')).toBeNull();
	});
});
