import z from 'zod';
import { msg } from '../msg';

export const ProfileDataUpdateSchema = z.object({
	names: z
		.string()
		.min(1, { message: msg.names.required })
		.max(20, { message: msg.names.maxLength })
		.regex(/^\D*$/, { message: msg.names.noNumbers })
		.regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, { message: msg.names.noSymbols }),
	surnames: z
		.string()
		.min(1, { message: msg.surnames.required })
		.max(20, { message: msg.surnames.maxLength })
		.regex(/^\D*$/, { message: msg.surnames.noNumbers })
		.regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, { message: msg.surnames.noSymbols }),
	phone: z
		.string()
		.min(1, { message: msg.phone.required })
		.regex(/^(?:\+58|58|0)?(2[0-9]{2}|4[0-9]{2}|[5-9][0-9]{2})[0-9]{7}$/, {
			message: msg.phone.pattern,
		}),
});

export const ProfileEmailUpdateSchema = z.object({
	email: z
		.email({ message: msg.email.invalid })
		.min(1, { message: msg.email.required }),
	password: z
		.string()
		.min(1, { message: msg.password.required }),
});

export const ProfilePasswordUpdateSchema = z
	.object({
		olPassword: z
			.string()
			.min(8, { message: msg.password.minLength })
			.regex(
				/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_,.?":{}|<>]).{8,}$/,
				{ message: msg.password.complexity },
			),
		newPassword: z
			.string()
			.min(8, { message: msg.password.minLength })
			.regex(
				/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_,.?":{}|<>]).{8,}$/,
				{ message: msg.password.complexity },
			),
		confirmNewPassword: z
			.string()
			.min(1, { message: msg.confirmPassword.required }),
	})
	.refine(data => {
		if (data.newPassword !== data.confirmNewPassword) {
			return {
				message: msg.confirmPassword.match,
				path: ['confirmNewPassword'],
			};
		}
		return true;
	});

export type ProfileDataUpdateTypes = z.infer<typeof ProfileDataUpdateSchema>;
export type ProfileEmailUpdateTypes = z.infer<typeof ProfileEmailUpdateSchema>;
export type ProfilePasswordUpdateTypes = z.infer<
	typeof ProfilePasswordUpdateSchema
>;
