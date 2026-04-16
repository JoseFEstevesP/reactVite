import { LimitFetchData } from '@/enums/limit';
import { OrderEnum } from '@/enums/order';
import { z } from 'zod';

export const FilterDataDTO = z.object({
	search: z.string().optional(),
	orderProperty: z.string().optional(),
	order: z
		.enum(Object.values(OrderEnum), {
			message: 'Orden inválido',
		})
		.optional(),
	limit: z
		.enum(Object.values(LimitFetchData), {
			message: 'Límite inválido',
		})
		.optional(),
});

export type FilterDataDTOType = z.infer<typeof FilterDataDTO>;
