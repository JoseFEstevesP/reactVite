import type { MenuItem } from '@/components/menu/types';

export interface LDashboardProps {
	menuItem: MenuItem[];
	menuOrientation?: 'horizontal' | 'vertical';
}
