import { Button } from '@/components/button/Button';
import { useCallback, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import type { ButtonThemeProps, Theme } from './types';

export const ButtonTheme = ({
	className,
	onThemeChange,
	...props
}: ButtonThemeProps) => {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') return 'light';
		const systemPrefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)',
		).matches;
		return (
			(localStorage.getItem('theme') as Theme) ||
			(systemPrefersDark ? 'dark' : 'light')
		);
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			const stored = localStorage.getItem('theme') as Theme | null;
			if (!stored) {
				setTheme(e.matches ? 'dark' : 'light');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	const toggleTheme = useCallback(() => {
		document.documentElement.setAttribute('data-theme-transition', 'true');
		setTheme(prevTheme => {
			const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
			onThemeChange?.(newTheme);
			setTimeout(() => {
				document.documentElement.removeAttribute('data-theme-transition');
			}, 400);
			return newTheme;
		});
	}, [onThemeChange]);

	const getIconName = () => (theme === 'dark' ? 'sun' : 'moon');

	return (
		<Button
			variant="theme"
			icon={{ iconName: getIconName() }}
			title={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
			onClick={toggleTheme}
			className={`${styles.themeButton} ${className || ''}`}
			aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
			data-theme={theme}
			{...props}
		/>
	);
};
