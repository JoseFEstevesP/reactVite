import { useLogout } from '@/api/hooks/useLogout';
import Menu from '@/components/menu/Menu';
import { Outlet } from 'react-router-dom';
import styles from './styles.module.scss';
import type { LDashboardProps } from './types';

const LDashboard = ({ menuItem, menuOrientation }: LDashboardProps) => {
	const logout = useLogout();

	return (
		<main className={styles.main}>
			<Menu
				items={menuItem}
				className={styles.main__sidebar}
				orientation={menuOrientation}
				onLogout={logout.mutate}
				showThemeToggle
			/>
			<section className={styles.main__content}>{<Outlet />}</section>
		</main>
	);
};
export default LDashboard;
