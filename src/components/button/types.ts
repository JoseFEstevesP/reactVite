import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconParameter } from '../icon/types';

export type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'ghost'
	| 'danger'
	| 'theme';

export const ButtonSize = {
	Small: 'sm',
	Medium: 'md',
	Large: 'lg',
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	loadingText?: string;
	icon?: IconParameter;
	text?: string;
	children?: ReactNode;
}
