import Loader from '@/components/loader/Loader';
import { lazy, Suspense } from 'react';
import useChartUser from '../hooks/useChartUser';
import styles from './styles.module.scss';

const BarChart = lazy(() => import('@/components/barChart/BarChart'));
const PieChart = lazy(() => import('@/components/pieChart/PieChart'));

const ChartUser = () => {
	const { data, isFetching } = useChartUser();

	if (!data || isFetching) {
		return <Loader />;
	}

	const statusData = [
		{
			label: 'Activos',
			value: data.usersByStatus?.active || 0,
			color: '#059669',
		},
		{
			label: 'Inactivos',
			value: data.usersByStatus?.inactive || 0,
			color: '#dc2626',
		},
	];

	const activationData = [
		{
			label: 'Activados',
			value: data.usersByActivation?.activated || 0,
			color: '#059669',
		},
		{
			label: 'Pendientes',
			value: data.usersByActivation?.pending || 0,
			color: '#d97706',
		},
	];

	const roleData = (data.usersByRole || []).map(role => ({
		label: role.rolName,
		value: role.count,
	}));

	return (
		<section className={styles.chart}>
			<Suspense fallback={<Loader />}>
				<h2 className={styles.chart__title}>Estadísticas de usuarios</h2>
				<div className={styles.chart__container}>
					<PieChart
						className={styles.chart__pie}
						data={statusData}
						donut
						showValues
					/>
					<PieChart
						className={styles.chart__pie}
						data={activationData}
						donut
						showValues
					/>
					<BarChart className={styles.chart__bar} data={roleData} animated />
				</div>
			</Suspense>
		</section>
	);
};
export default ChartUser;
