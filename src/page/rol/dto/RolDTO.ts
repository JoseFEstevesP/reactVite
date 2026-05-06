import z from 'zod';
import { Permission } from '../enum/Permissions';
import { msg } from '../msg';

const PermissionEnum = z.enum(Permission);

export const RolDTOSchema = z.object({
	uid: z.string().min(1, { message: msg.uid.required }),
	name: z
		.string()
		.min(1, { message: msg.name.required })
		.min(3, { message: msg.name.minLength })
		.max(255, { message: msg.name.maxLength }),
	description: z
		.string()
		.min(1, { message: msg.description.required })
		.min(3, { message: msg.description.minLength })
		.max(255, { message: msg.description.maxLength }),
	permissions: z
		.array(z.string().min(1, { message: msg.permissions.invalid }))
		.min(1, { message: msg.permissions.required }),
	status: z.boolean({ message: msg.status.required }),
});

export const RolRegisterDTOSchema = RolDTOSchema.pick({
	name: true,
	description: true,
}).extend({
	permissions: z
		.array(PermissionEnum)
		.min(1, { message: msg.permissions.required }),
});

export const RolUpdateDTOSchema = RolDTOSchema.pick({
	name: true,
	description: true,
	status: true,
}).extend({
	uid: z.string().min(1, { message: msg.uid.required }),
	permissions: z
		.array(PermissionEnum)
		.min(1, { message: msg.permissions.required })
		.optional(),
});

export const RolUpdateFormSchema = RolDTOSchema.pick({
	name: true,
	description: true,
}).extend({
	uid: z.string().min(1, { message: msg.uid.required }),
	permissions: z
		.array(PermissionEnum)
		.min(1, { message: msg.permissions.required })
		.optional(),
	status: z.enum(['true', 'false'], { message: msg.status.required }),
});

export type RolUpdateFormTypes = z.infer<typeof RolUpdateFormSchema>;

export type RolDTOTypes = z.infer<typeof RolDTOSchema>;
export type RolRegisterDTOTypes = z.infer<typeof RolRegisterDTOSchema>;
export type RolUpdateDTOTypes = z.infer<typeof RolUpdateDTOSchema>;
