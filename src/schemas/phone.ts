import z from 'zod';

export const phoneSchema = z
	.string()
	.min(1)
	.regex(
		/^(?:\+58|58|0)?(2[0-9]{2}|4[0-9]{2}|[5-9][0-9]{2})[0-9]{7}$/,
	);
