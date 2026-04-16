import { useState } from 'react';
import { Icons } from '../icon/Icons';
import styles from './styles.module.scss';
import type { InputProps } from './types';
import { renderErrorMessage } from './renderErrorMessage';

export const Input = ({
	name,
	placeholder,
	error,
	className,
	type = 'text',
	label,
	disabled = false,
	iconName,
	size = 'md',
	fullWidth = false,
	register,
	min,
	max,
	minLength,
	maxLength,
	required,
	autoComplete,
	defaultValue,
	...props
}: InputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	const isPasswordType = type === 'password';
	const sizeClass = styles[`input__container--${size}`];
	const containerClass = `${styles.input__container} ${sizeClass} ${
		error ? styles['input__container--error'] : ''
	} ${disabled ? styles['input__container--disabled'] : ''}`;

	const inputProps = register ? { ...register(name) } : {};

	const inputType = isPasswordType
		? showPassword
			? 'text'
			: 'password'
		: type;

	return (
		<div
			className={`${styles.input} ${fullWidth ? styles['input--fullWidth'] : ''} ${className || ''}`}
		>
			{label && (
				<label htmlFor={name} className={styles.input__label}>
					{label}
					{required && (
						<span style={{ color: 'var(--input-invalid)' }}> *</span>
					)}
				</label>
			)}
			<div className={containerClass}>
				{iconName && (
					<div className={styles.input__contentIcon}>
						<Icons
							iconName={iconName}
							className={`${styles.input__icon} ${error ? styles['input__icon--error'] : ''}`}
						/>
					</div>
				)}
				<input
					id={name}
					placeholder={placeholder}
					type={inputType}
					className={styles.input__input}
					disabled={disabled}
					aria-invalid={error ? 'true' : 'false'}
					aria-describedby={error ? `${name}-error` : undefined}
					min={type === 'number' ? min : undefined}
					max={type === 'number' ? max : undefined}
					minLength={minLength}
					maxLength={maxLength}
					required={required}
					autoComplete={
						autoComplete ||
						(isPasswordType
							? showPassword
								? 'off'
								: 'current-password'
							: undefined)
					}
					defaultValue={defaultValue}
					{...inputProps}
					{...props}
				/>
				{isPasswordType && !disabled && (
					<button
						type="button"
						className={styles.input__visibilityButton}
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						<Icons iconName={showPassword ? 'eye' : 'eye_off'} size="1.2em" />
					</button>
				)}
				{disabled && !isPasswordType && (
					<Icons
						iconName="padlock"
						size="0.7em"
						className={styles.input__iconDisabled}
					/>
				)}
			</div>
			{error && (
				<span id={`${name}-error`} className={styles.input__errorMessage}>
					{renderErrorMessage(error.message)}
				</span>
			)}
		</div>
	);
};
