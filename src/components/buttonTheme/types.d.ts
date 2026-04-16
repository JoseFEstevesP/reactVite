import type { ButtonHTMLAttributes } from 'react';

export type Theme = 'light' | 'dark';

export interface ButtonThemeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onThemeChange?: (theme: Theme) => void;
}
