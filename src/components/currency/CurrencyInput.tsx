import { useState, useEffect, useRef, useCallback } from 'react';
import { type FieldValues, useController, type Control } from 'react-hook-form';
import { Select } from '../select/Select';
import styles from './styles.module.scss';
import type { CurrencySymbol } from './types';
import { currencyConfigs, currencyOptions } from './types';
import type { ValueAll } from '@/hooks/useRenderInputs/useRenderInputsType';

interface CurrencyInputProps<T extends FieldValues> {
	name: string;
	nameCurrency?: string;
	label?: string;
	placeholder?: string;
	className?: string;
	defaultValue?: string;
	defaultCurrency?: CurrencySymbol;
	max?: number;
	disabled?: boolean;
	control?: Control<T>;
	error?: { message?: string };
}

export const CurrencyInput = <T extends FieldValues = FieldValues>({
	name,
	nameCurrency,
	label,
	placeholder = '0.00',
	className,
	defaultValue = '',
	defaultCurrency = '$',
	max = 999999999.99,
	disabled = false,
	control,
	error,
}: CurrencyInputProps<T>) => {
	const currencyName = nameCurrency || `${name}Currency`;
	const inputRef = useRef<HTMLInputElement>(null);
	const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);

	const {
		field: amountField,
	} = useController({
		name: name as any,
		control: control as any,
		defaultValue: defaultValue,
	});

	const {
		field: currencyField,
	} = useController({
		name: currencyName as any,
		control: control as any,
		defaultValue: defaultCurrency,
	});

	const config = currencyConfigs[currentCurrency];

	const formatValue = useCallback((value: string): string => {
		if (!value) return '';
		
		const cleanValue = value.replace(/[^\d]/g, '');
		if (!cleanValue) return '';

		const intPart = cleanValue.slice(0, -2) || '0';
		const decPart = cleanValue.slice(-2);

		const numInt = parseInt(intPart, 10) || 0;
		const intWithSeparators = String(numInt).replace(
			/\B(?=(\d{3})+(?!\d))/g,
			config.thousandSeparator,
		);

		return `${intWithSeparators}${config.decimalSeparator}${decPart}`;
	}, [config.thousandSeparator, config.decimalSeparator]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/[^\d]/g, '');
		
		if (!raw) {
			e.target.value = '';
			amountField.onChange('');
			return;
		}

		const numValue = parseInt(raw, 10);

		if (numValue > max) {
			e.target.value = formatValue(String(max).padStart(3, '0'));
			return;
		}

		const formatted = formatValue(raw);
		const cursorPos = e.target.selectionStart || 0;
		const oldLength = e.target.value.length;
		
		e.target.value = formatted;
		
		const newLength = formatted.length;
		const diff = newLength - oldLength;
		const newCursorPos = Math.max(0, cursorPos + diff);
		
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
			}
		}, 0);

		amountField.onChange(raw);
	};

	const handleBlur = () => {
		if (inputRef.current) {
			const raw = amountField.value as string;
			if (raw) {
				inputRef.current.value = formatValue(raw);
				amountField.onBlur();
			}
		}
	};

	const handleFocus = () => {
		if (inputRef.current && amountField.value) {
			inputRef.current.value = amountField.value as string;
		}
	};

	useEffect(() => {
		const newCurrency = currencyField.value as CurrencySymbol;
		if (newCurrency && newCurrency !== currentCurrency) {
			setCurrentCurrency(newCurrency);
		}
	}, [currencyField.value]);

	useEffect(() => {
		if (amountField.value && inputRef.current) {
			const raw = String(amountField.value).replace(/[^\d]/g, '');
			if (raw) {
				inputRef.current.value = formatValue(raw);
			}
		}
	}, [currentCurrency]);

	return (
		<div className={`${styles.currency} ${className || ''}`}>
			{label && (
				<label htmlFor={name} className={styles.currency__label}>
					{label}
				</label>
			)}
			<div className={styles.currency__container}>
				<div className={styles.currency__select}>
					<Select<T>
						name={currencyName}
						control={control}
						options={currencyOptions as ValueAll[]}
						defaultValue={currentCurrency}
						disabled={disabled}
						className={styles.currency__select}
					/>
				</div>
				<div className={styles.currency__input}>
					<input
						ref={inputRef}
						id={name}
						type="text"
						placeholder={placeholder}
						className={`${styles.currency__inputField} ${
							error ? styles['currency__inputField--error'] : ''
						}`}
						disabled={disabled}
						onChange={handleInputChange}
						onBlur={handleBlur}
						onFocus={handleFocus}
					/>
				</div>
			</div>
			{error && (
				<span className={styles.currency__error}>{error.message}</span>
			)}
		</div>
	);
};

export const formatForDisplay = (
	value: string,
	symbol: CurrencySymbol,
): string => {
	if (!value) return '';
	const cfg = currencyConfigs[symbol];

	const cleanValue = value.replace(/[^\d]/g, '');
	if (!cleanValue) return '';

	const intPart = cleanValue.slice(0, -2) || '0';
	const decPart = cleanValue.slice(-2);
	const numInt = parseInt(intPart, 10) || 0;
	const intWithSeparators = String(numInt).replace(
		/\B(?=(\d{3})+(?!\d))/g,
		cfg.thousandSeparator,
	);

	return `${intWithSeparators}${cfg.decimalSeparator}${decPart}`;
};

export default CurrencyInput;