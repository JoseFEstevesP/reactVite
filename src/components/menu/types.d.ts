import type { ReactNode } from 'react';
import type { IconPack, NameIcon } from '../icon/types';

export type MenuOrientation = 'vertical' | 'horizontal';

export interface MenuItem {
	text: string;
	to?: string;
	icon: NameIcon;
	pack?: IconPack;
	sub?: MenuItem[];
}

export interface MenuProps {
	items: MenuItem[];
	orientation?: MenuOrientation;
	expanded?: boolean;
	onToggle?: () => void;
	onLogout?: () => void;
	showProfile?: boolean;
	showThemeToggle?: boolean;
	userName?: string;
	notificationBell?: ReactNode;
	className?: string;
}
