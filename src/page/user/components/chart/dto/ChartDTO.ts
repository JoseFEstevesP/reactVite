import { z } from 'zod';
import { msg } from '../../../../common/chart/dto/msg';

export const UsersByStatusDTOSchema = z.object({
	active: z.number().int().nonnegative(),
	inactive: z.number().int().nonnegative(),
});

export type UsersByStatusDTOTypes = z.infer<typeof UsersByStatusDTOSchema>;

export const UsersByRoleDTOSchema = z.object({
	rolName: z.string().min(1, { message: msg.rolName.required }),
	count: z.union([z.number(), z.string()]).transform(val => Number(val)),
});

export type UsersByRoleDTOTypes = z.infer<typeof UsersByRoleDTOSchema>;

export const UsersByActivationDTOSchema = z.object({
	activated: z.number().int().nonnegative(),
	pending: z.number().int().nonnegative(),
});

export type UsersByActivationDTOTypes = z.infer<
	typeof UsersByActivationDTOSchema
>;

export const UserChartDataResponseDTOSchema = z.object({
	usersByStatus: UsersByStatusDTOSchema,
	usersByRole: z.array(UsersByRoleDTOSchema),
	usersByActivation: UsersByActivationDTOSchema,
});

export type UserChartDataResponseDTOTypes = z.infer<
	typeof UserChartDataResponseDTOSchema
>;

export const ApiResponseDTOSchema = z.object({
	success: z.boolean(),
	data: UserChartDataResponseDTOSchema,
});

export type ApiResponseDTOTypes = z.infer<typeof ApiResponseDTOSchema>;
