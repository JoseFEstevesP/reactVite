import { Icons } from '../icon/Icons';
import styles from './styles.module.scss';
import type { BtnProps } from './types';

export const Button = ({
	variant = 'primary',
	size = 'md',
	loading = false,
	loadingText,
	icon,
	text,
	children,
	className,
	disabled,
	...props
}: BtnProps) => {
	const isDisabled = disabled || loading;
	const buttonText = loading && loadingText ? loadingText : text || children;

	const variantClass = styles[`button--${variant}`];
	const sizeClass = styles[`button--${size}`];

	return (
		<button
			{...props}
			type={props.type || 'button'}
			className={`${styles.button} ${variantClass} ${sizeClass} ${
				isDisabled ? styles['button--disabled'] : ''
			} ${loading ? styles['button--loading'] : ''} ${className || ''}`}
			disabled={isDisabled}
			aria-disabled={isDisabled}
			aria-busy={loading}
			{...(buttonText && { 'aria-label': props['aria-label'] || props.title })}
		>
			{loading ? (
				<Icons
					iconName="spinner"
					className={`${styles.button__icon} ${styles.button__spinner}`}
					size={size === 'sm' ? '0.875em' : size === 'lg' ? '1.25em' : '1em'}
				/>
			) : (
				icon?.iconName && (
					<Icons
						{...icon}
						className={`${styles.button__icon} ${icon.className || ''}`}
					/>
				)
			)}
			{(!loading || loadingText) && buttonText}
			{isDisabled && !loading && icon?.iconName && (
				<Icons
					iconName="padlock"
					className={styles.button__iconDisabled}
					size="0.7em"
				/>
			)}
		</button>
	);
};

Button.styles = styles;
