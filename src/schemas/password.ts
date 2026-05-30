import z from 'zod';

export const passwordMin = 8;
export const passwordMax = 20;

export const passwordSchema = z
	.string()
	.min(passwordMin)
	.max(passwordMax)
	.regex(
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_,.?":{}|<>]).{8,20}$/,
	);
