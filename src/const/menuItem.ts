import type { MenuItem } from '@/components/menu/types';
import { Permission } from '@/enums/permissions';

export const menuItem: MenuItem[] = [
	{
		icon: 'home',
		text: 'Dashboard',
		to: '/',
		per: Permission.dashboard,
	},
	{ icon: 'rol', text: 'Rol', to: '/rol', per: Permission.rol },
	{
		icon: 'user',
		text: 'Users',
		to: '/users',
		per: Permission.user,
	},
	{
		icon: 'audit',
		text: 'Auditoría',
		to: '/audits',
		per: Permission.audit,
	},
];
