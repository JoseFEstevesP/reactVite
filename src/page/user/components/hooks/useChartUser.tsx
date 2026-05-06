import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import type { UseQueryResult } from '@tanstack/react-query';
import type {
	ApiResponseDTOTypes,
	UserChartDataResponseDTOTypes,
} from '../chart/dto/ChartDTO';

interface UseChartUserReturn {
	data?: UserChartDataResponseDTOTypes;
	isFetching: boolean;
	refetch: () => Promise<UseQueryResult<ApiResponseDTOTypes>>;
}

const useChartUser = (): UseChartUserReturn => {
	const result = useGet<ApiResponseDTOTypes>(routes.userCharts, {
		queryKey: ['userCharts'],
	});

	return {
		data: result.data?.data,
		isFetching: result.isFetching,
		refetch: result.refetch,
	};
};
export default useChartUser;
