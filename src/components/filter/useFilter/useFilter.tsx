import { LimitFetchData } from '@/enums/limit';
import { OrderEnum } from '@/enums/order';
import { useCallback, useMemo, useState } from 'react';

export interface FilterState {
	limit: string;
	order: string;
	orderProperty: string;
	page?: number;
	[key: string]: string | number | undefined;
}

const useFilter = ({
	orderProperty,
	addProperty,
}: {
	orderProperty: string;
	addProperty?: Record<string, string>;
}) => {
	const initialFilter = useMemo(
		(): FilterState => ({
			limit: LimitFetchData['d-20'],
			order: OrderEnum.ASC,
			orderProperty,
			...addProperty,
		}),
		[addProperty, orderProperty],
	);

	const [filter, setFilter] = useState<FilterState>(initialFilter);

	const handlePagination = useCallback((page: number) => {
		setFilter(prevFilter => ({ ...prevFilter, page }));
	}, []);

	const handleFilterData = useCallback((data: Partial<FilterState>) => {
		setFilter(prevFilter => ({ ...prevFilter, ...data }));
	}, []);

	const handleResetData = useCallback(() => {
		setFilter(initialFilter);
	}, [initialFilter]);

	return {
		filter,
		handlePagination,
		handleFilterData,
		handleResetData,
	};
};

export default useFilter;
