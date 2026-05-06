import z from 'zod';
import { msg } from '../msg';

export const UserDTOSchema = z.object({
	uid: z.string().min(1, { message: 'UID inválido' }),
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
	email: z
		.email({ message: msg.email.invalid })
		.min(1, { message: msg.email.required }),
	password: z
		.string()
		.min(8, { message: msg.password.minLength })
		.max(20, { message: msg.password.maxLength })
		.regex(
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_,.?":{}|<>]).{8,20}$/,
			{
				message: msg.password.complexity,
			},
		),
	uidRol: z.string().min(1, { message: msg.uidRol.required }),
	rol: z.object({
		name: z.string().min(1, { message: msg.uidRol.required }),
		permissions: z.array(z.string().min(1, { message: msg.uidRol.required })),
	}),
	status: z.boolean({ message: msg.status.required }),
	activatedAccount: z.boolean({ message: msg.activatedAccount.required }),
});

export type UserDTOTypes = z.infer<typeof UserDTOSchema>;

export const UserRegisterDTOSchema = UserDTOSchema.pick({
	names: true,
	surnames: true,
	phone: true,
	email: true,
	password: true,
	uidRol: true,
})
	.extend({
		confirmPassword: z
			.string()
			.min(1, { message: msg.confirmPassword.required }),
	})
	.refine(data => {
		if (data.password !== data.confirmPassword) {
			return {
				message: msg.confirmPassword.match,
				path: ['confirmPassword'],
			};
		}
		return true;
	});

export const UserUpdateDTOSchema = UserDTOSchema.pick({
	names: true,
	surnames: true,
	phone: true,
	email: true,
	uidRol: true,
	status: true,
}).extend({
	uid: z.string().min(1, { message: 'UID inválido' }),
	activatedAccount: z.boolean({ message: msg.activatedAccount.required }),
});

export const UserUpdateFormSchema = UserDTOSchema.pick({
	names: true,
	surnames: true,
	phone: true,
	email: true,
	uidRol: true,
}).extend({
	uid: z.string().min(1, { message: 'UID inválido' }),
	status: z.enum(['true', 'false'], { message: msg.status.required }),
	activatedAccount: z.enum(['true', 'false'], {
		message: msg.activatedAccount.required,
	}),
});

export type UserRegisterDTOTypes = z.infer<typeof UserRegisterDTOSchema>;
export type UserUpdateDTOTypes = z.infer<typeof UserUpdateDTOSchema>;
export type UserUpdateFormTypes = z.infer<typeof UserUpdateFormSchema>;
