import { describe, expect, it } from 'vitest';
import { LoginDTOSchema } from './LoginDTO';

describe('LoginDTOSchema', () => {
	it('accepts valid email and password', () => {
		const result = LoginDTOSchema.safeParse({
			email: 'test@example.com',
			password: 'Abcd1234!',
		});
		expect(result.success).toBe(true);
	});

	it('rejects invalid email', () => {
		const result = LoginDTOSchema.safeParse({
			email: 'not-an-email',
			password: 'Abcd1234!',
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].path).toContain('email');
		}
	});

	it('rejects short password', () => {
		const result = LoginDTOSchema.safeParse({
			email: 'test@example.com',
			password: 'Ab1!',
		});
		expect(result.success).toBe(false);
	});

	it('rejects empty email', () => {
		const result = LoginDTOSchema.safeParse({
			email: '',
			password: 'Abcd1234!',
		});
		expect(result.success).toBe(false);
	});

	it('rejects missing fields', () => {
		const result = LoginDTOSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});
