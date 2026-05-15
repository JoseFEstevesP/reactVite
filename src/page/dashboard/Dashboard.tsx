import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import BarChart from '@/components/barChart/BarChart';
import Loader from '@/components/loader/Loader';
import PieChart from '@/components/pieChart/PieChart';
import type { ApiResponse } from '@/globalTypes';
import styles from './styles.module.scss';
import type { DashboardData } from './types';

const Dashboard = () => {
	const { data, isPending, isError, refetch } = useGet<
		ApiResponse<DashboardData>
	>(routes.dashboard, {
		queryKey: ['dashboard'],
		refetchOnMount: true,
	});

	if (isPending) {
		return <Loader />;
	}

	if (isError) {
		return (
			<section className={styles.dashboard}>
				<div className={styles.dashboard__error}>
					<p>Error al cargar los datos del dashboard</p>
					<button type="button" onClick={() => refetch()}>
						Reintentar
					</button>
				</div>
			</section>
		);
	}

	const dashboardData = data?.data;

	if (!dashboardData) {
		return (
			<section className={styles.dashboard}>
				<div className={styles.dashboard__empty}>No hay datos disponibles</div>
			</section>
		);
	}

	return (
		<section className={styles.dashboard}>
			<div className={styles.dashboard__cards}>
				<div className={styles.dashboard__card}>
					<span className={styles.dashboard__cardIcon}>U</span>
					<div>
						<p className={styles.dashboard__cardLabel}>Usuarios totales</p>
						<p className={styles.dashboard__cardValue}>
							{dashboardData.totalUsers}
						</p>
					</div>
				</div>
				<div className={styles.dashboard__card}>
					<span className={styles.dashboard__cardIcon}>A</span>
					<div>
						<p className={styles.dashboard__cardLabel}>Usuarios activos</p>
						<p className={styles.dashboard__cardValue}>
							{dashboardData.activeUsers}
						</p>
					</div>
				</div>
				<div className={styles.dashboard__card}>
					<span className={styles.dashboard__cardIcon}>S</span>
					<div>
						<p className={styles.dashboard__cardLabel}>Sesiones activas</p>
						<p className={styles.dashboard__cardValue}>
							{dashboardData.activeSessions}
						</p>
					</div>
				</div>
			</div>

			<div className={styles.dashboard__charts}>
				<div className={styles.dashboard__chartItem}>
					<h2 className={styles.dashboard__chartTitle}>Usuarios por estado</h2>
					<PieChart
						data={[
							{
								label: 'Activos',
								value: dashboardData.usersByStatus.active,
								color: '#059669',
							},
							{
								label: 'Inactivos',
								value: dashboardData.usersByStatus.inactive,
								color: '#dc2626',
							},
						]}
						donut
					/>
				</div>
			</div>

			<div className={styles.dashboard__chartsWide}>
				<div className={styles.dashboard__chartItem}>
					<h2 className={styles.dashboard__chartTitle}>Usuarios por rol</h2>
					<BarChart
						data={dashboardData.usersByRole.map(item => ({
							label: item.rolName,
							value: Number(item.count),
						}))}
						showValues
					/>
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
