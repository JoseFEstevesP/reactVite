import { describe, expect, it } from 'vitest';
import {
	UserDTOSchema,
	UserRegisterDTOSchema,
	UserUpdateDTOSchema,
	UserUpdateFormSchema,
} from './UserDTO';

describe('UserDTOSchema', () => {
	it('accepts valid user data', () => {
		const result = UserDTOSchema.safeParse({
			uid: 'abc123',
			names: 'John',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			password: 'Abcd1234!',
			uidRol: 'rol1',
			rol: { name: 'Admin', permissions: ['USER_READ'] },
			status: true,
			activatedAccount: true,
		});
		expect(result.success).toBe(true);
	});

	it('rejects names with numbers', () => {
		const result = UserDTOSchema.safeParse({
			uid: 'abc123',
			names: 'John123',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			password: 'Abcd1234!',
			uidRol: 'rol1',
			rol: { name: 'Admin', permissions: ['USER_READ'] },
			status: true,
			activatedAccount: true,
		});
		expect(result.success).toBe(false);
	});
});

describe('UserRegisterDTOSchema', () => {
	it('rejects missing confirmPassword', () => {
		const result = UserRegisterDTOSchema.safeParse({
			names: 'John',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			password: 'Abcd1234!',
			uidRol: 'rol1',
		});
		expect(result.success).toBe(false);
	});

	it('accepts valid registration data', () => {
		const result = UserRegisterDTOSchema.safeParse({
			names: 'John',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			password: 'Abcd1234!',
			confirmPassword: 'Abcd1234!',
			uidRol: 'rol1',
		});
		expect(result.success).toBe(true);
	});
});

describe('UserUpdateDTOSchema', () => {
	it('accepts valid update data', () => {
		const result = UserUpdateDTOSchema.safeParse({
			uid: 'abc',
			names: 'John',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			uidRol: 'rol1',
			status: true,
			activatedAccount: true,
		});
		expect(result.success).toBe(true);
	});
});

describe('UserUpdateFormSchema', () => {
	it('accepts valid form data', () => {
		const result = UserUpdateFormSchema.safeParse({
			uid: 'abc',
			names: 'John',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			uidRol: 'rol1',
			status: 'true',
			activatedAccount: 'false',
		});
		expect(result.success).toBe(true);
	});

	it('rejects invalid status value', () => {
		const result = UserUpdateFormSchema.safeParse({
			uid: 'abc',
			names: 'John',
			surnames: 'Doe',
			phone: '04121234567',
			email: 'john@example.com',
			uidRol: 'rol1',
			status: 'invalid',
			activatedAccount: 'true',
		});
		expect(result.success).toBe(false);
	});
});
