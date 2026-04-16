import { format } from '@formkit/tempo';

export const dateFormate = (
	date: string | Date | null | undefined,
	formate?: string,
) => {
	if (!date) return '-';
	const dateFormat = formate ? formate : 'DD/MM/YYYY';
	return format(date, dateFormat);
};
