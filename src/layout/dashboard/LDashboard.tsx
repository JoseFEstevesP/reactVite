import { useLogout } from '@/api/hooks/useLogout';
import Menu from '@/components/menu/Menu';
import NotificationBell from '@/components/notification/NotificationBell';
import useValidate from '@/hooks/useValidate';
import { Outlet } from 'react-router-dom';
import styles from './styles.module.scss';
import type { LDashboardProps } from './types';

const LDashboard = ({ menuItem, menuOrientation }: LDashboardProps) => {
	const logout = useLogout();
	const { handleData } = useValidate();

	const filteredItems = menuItem.filter(
		item => !item.per || handleData({ per: item.per }),
	);

	return (
		<main className={styles.main}>
			<Menu
				items={filteredItems}
				className={styles.main__sidebar}
				orientation={menuOrientation}
				onLogout={logout.mutate}
				showThemeToggle
				showProfile
				notificationBell={<NotificationBell />}
			/>
			<section className={styles.main__content}>{<Outlet />}</section>
		</main>
	);
};
export default LDashboard;
