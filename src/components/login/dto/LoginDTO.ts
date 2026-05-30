import z from 'zod';

export const LoginDTOSchema = z.object({
	email: z
		.string()
		.email({ message: 'Correo inválido' })
		.min(1, { message: 'Correo requerido' }),
	password: z
		.string()
		.min(8, { message: 'Contraseña demasiado corta' })
		.max(20, { message: 'Contraseña demasiado larga' }),
});
export type LoginDTOTypes = z.infer<typeof LoginDTOSchema>;
