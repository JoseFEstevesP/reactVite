import { useState, useRef, useEffect, useCallback } from 'react';
import { type FieldValues, type Path } from 'react-hook-form';
import { Icons } from '../icon/Icons';
import styles from './styles.module.scss';
import type { InputProps } from './types';
import { renderErrorMessage } from './renderErrorMessage';
import { Calendar } from './Calendar';

export const Input = <T extends FieldValues = FieldValues>({
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
	onChange,
	...props
}: InputProps<T>) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showCalendar, setShowCalendar] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [dateValue, setDateValue] = useState((defaultValue as string) || '');

	const isPasswordType = type === 'password';
	const isDateType = type === 'date';
	const sizeClass = styles[`input__container--${size}`];
	const containerClass = `${styles.input__container} ${sizeClass} ${
		error ? styles['input__container--error'] : ''
	} ${disabled ? styles['input__container--disabled'] : ''}`;

	const registerResult = register ? register(name as Path<T>) : null;

	const inputType = isPasswordType
		? showPassword
			? 'text'
			: 'password'
		: isDateType
			? 'text'
			: type;

	useEffect(() => {
		if (!showCalendar) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setShowCalendar(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showCalendar]);

	const handleDateSelect = useCallback(
		(date: string) => {
			setDateValue(date);
			const input = inputRef.current;
			if (input) {
				input.value = date;
				input.dispatchEvent(new Event('input', { bubbles: true }));
				input.dispatchEvent(new Event('change', { bubbles: true }));
			}
			if (registerResult?.onChange) {
				const event = {
					target: { value: date, name },
				} as React.ChangeEvent<HTMLInputElement>;
				registerResult.onChange(event);
			}
			if (onChange) {
				const event = {
					target: { value: date, name },
				} as React.ChangeEvent<HTMLInputElement>;
				onChange(event);
			}
			setShowCalendar(false);
		},
		[registerResult, onChange, name],
	);

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
			<div ref={wrapperRef} className={styles.input__wrapper}>
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
						ref={isDateType ? inputRef : undefined}
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
						defaultValue={isDateType ? undefined : defaultValue}
						value={isDateType ? dateValue : undefined}
						{...registerResult}
						{...props}
						onClick={isDateType ? () => setShowCalendar(true) : undefined}
						readOnly={isDateType}
					/>
					{isDateType && !disabled && (
						<button
							type="button"
							className={styles.input__visibilityButton}
							onClick={() => setShowCalendar(prev => !prev)}
							aria-label="Select date"
						>
							<Icons iconName="date" size="1.2em" />
						</button>
					)}
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
				{isDateType && showCalendar && (
					<div className={styles.input__calendarPopup}>
						<Calendar selectedDate={dateValue} onSelect={handleDateSelect} />
					</div>
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
