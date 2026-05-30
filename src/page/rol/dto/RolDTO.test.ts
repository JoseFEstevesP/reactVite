import { describe, expect, it } from 'vitest';
import {
	RolDTOSchema,
	RolRegisterDTOSchema,
	RolUpdateFormSchema,
} from './RolDTO';

describe('RolDTOSchema', () => {
	it('accepts valid role data', () => {
		const result = RolDTOSchema.safeParse({
			uid: 'rol1',
			name: 'Admin',
			description: 'Administrator role',
			permissions: ['USER_READ', 'USER_WRITE'],
			status: true,
		});
		expect(result.success).toBe(true);
	});

	it('rejects short name', () => {
		const result = RolDTOSchema.safeParse({
			uid: 'rol1',
			name: 'Ab',
			description: 'Role',
			permissions: ['USER_READ'],
			status: true,
		});
		expect(result.success).toBe(false);
	});

	it('rejects empty permissions', () => {
		const result = RolDTOSchema.safeParse({
			uid: 'rol1',
			name: 'Admin',
			description: 'Desc',
			permissions: [],
			status: true,
		});
		expect(result.success).toBe(false);
	});
});

describe('RolRegisterDTOSchema', () => {
	it('accepts valid registration data', () => {
		const result = RolRegisterDTOSchema.safeParse({
			name: 'Editor',
			description: 'Can edit content',
			permissions: ['USER_READ'],
		});
		expect(result.success).toBe(true);
	});
});

describe('RolUpdateFormSchema', () => {
	it('accepts valid update form data', () => {
		const result = RolUpdateFormSchema.safeParse({
			uid: 'rol1',
			name: 'Admin',
			description: 'Desc',
			permissions: ['USER_READ'],
			status: 'true',
		});
		expect(result.success).toBe(true);
	});

	it('rejects invalid status value', () => {
		const result = RolUpdateFormSchema.safeParse({
			uid: 'rol1',
			name: 'Admin',
			description: 'Desc',
			permissions: ['USER_READ'],
			status: 'invalid',
		});
		expect(result.success).toBe(false);
	});
});
