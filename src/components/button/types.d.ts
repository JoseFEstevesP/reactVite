import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconParameter } from '../icon/types';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'ghost'
	| 'danger'
	| 'theme';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	loadingText?: string;
	icon?: IconParameter;
	text?: string;
	children?: ReactNode;
}
