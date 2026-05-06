import { UserDTOSchema } from '@/page/user/dto/UserDTO';
import z from 'zod';

export const LoginDTOSchema = UserDTOSchema.pick({
	email: true,
	password: true,
});
export type LoginDTOTypes = z.infer<typeof LoginDTOSchema>;
