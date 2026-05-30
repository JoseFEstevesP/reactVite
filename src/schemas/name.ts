import z from 'zod';

export const nameMax = 20;

export const nameSchema = z
	.string()
	.min(1)
	.max(nameMax)
	.regex(/^\D*$/)
	.regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/);
