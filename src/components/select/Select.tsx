import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../button/Button';
import { Icons } from '../icon/Icons';
import { renderErrorMessage } from '../input/renderErrorMessage';
import styles from './styles.module.scss';
import type { SelectMultipleProps, SelectProps } from './types';

const SelectInput = ({
	label,
	value,
	onChange,
	placeholder = 'Seleccionar...',
	options = [],
	error,
	className,
	defaultValue,
	disabled = false,
	enableSearch = false,
	iconName,
	...props
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentValue = value ?? defaultValue ?? '';

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
				containerRef.current?.focus();
			}
		};
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}
	}, [isOpen]);

	const handleToggle = useCallback(() => {
		if (!disabled) setIsOpen(prev => !prev);
	}, [disabled]);

	const filteredOptions = options.filter(option =>
		option.label?.toLowerCase().includes(search.toLowerCase()),
	);

	const handleOptionClick = (optionValue: string) => {
		if (!disabled) {
			onChange?.(optionValue);
			setIsOpen(false);
			setSearch('');
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent, optionValue: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleOptionClick(optionValue);
		}
	};

	const selectedOption = options.find(opt => opt.value === currentValue);

	return (
		<section
			className={`${styles.select} ${className || ''}`}
			ref={dropdownRef}
			{...props}
		>
			{label && <h2 className={styles.select__label}>{label}</h2>}
			<div
				ref={containerRef}
				className={`${styles.select__container} ${
					error ? styles['select__container--error'] : ''
				}`}
			>
				{iconName && (
					<div className={styles.select__contentIcon}>
						<Icons
							iconName={iconName}
							className={`${styles.select__icon} ${
								error ? styles['select__icon--error'] : ''
							} ${disabled ? styles['select__icon--disabled'] : ''}`}
						/>
					</div>
				)}
				<Button
					variant="theme"
					onClick={handleToggle}
					className={styles.select__btn}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					disabled={disabled}
					icon={{
						iconName: 'arrow',
						className: `${
							styles.select__iconAnimated
						} ${isOpen ? styles['select__iconAnimated--active'] : ''}`,
					}}
				>
					<div className={styles.select__contentValue}>
						{selectedOption ? (
							<span
								className={`${styles.select__value} ${
									!iconName ? styles['select__value--noIcon'] : ''
								}`}
							>
								{selectedOption.label}
							</span>
						) : (
							<span
								className={`${styles.select__value} ${
									styles['select__value--placeholder']
								} ${!iconName ? styles['select__value--noIcon'] : ''}`}
							>
								{placeholder}
							</span>
						)}
					</div>
				</Button>
			</div>

			<div
				role="listbox"
				className={`${styles.select__dropdown} ${
					isOpen ? styles['select__dropdown--open'] : ''
				}`}
				aria-hidden={!isOpen}
			>
				{enableSearch && (
					<div className={styles.select__search}>
						<input
							type="search"
							placeholder="Buscar..."
							value={search}
							onChange={e => setSearch(e.target.value)}
							className={styles.select__searchInput}
						/>
					</div>
				)}

				<ul className={styles.select__menu} role="options">
					{filteredOptions.length > 0 ? (
						filteredOptions.map(option => (
							<li
								key={option.value}
								tabIndex={0}
								role="option"
								onClick={() => handleOptionClick(option.value)}
								onKeyDown={e => handleKeyDown(e, option.value)}
								className={`${styles.select__option} ${
									currentValue === option.value
										? styles['select__option--selected']
										: ''
								}`}
								aria-selected={currentValue === option.value}
							>
								<span>{option.label}</span>
								<Icons
									iconName={
										currentValue === option.value ? 'checkBoxOn' : 'checkBoxOff'
									}
									className={styles.select__optionIcon}
								/>
							</li>
						))
					) : (
						<li className={styles.select__option} aria-disabled="true">
							<span>No se encontraron resultados</span>
						</li>
					)}
				</ul>
			</div>

			{error && (
				<span className={styles.select__error}>
					{renderErrorMessage(error?.message)}
				</span>
			)}
		</section>
	);
};

const SelectMultiple = ({
	label,
	value,
	onChange,
	placeholder = 'Seleccionar...',
	options = [],
	error,
	className,
	defaultValue = [],
	disabled = false,
	enableSearch = false,
	iconName,
	...props
}: SelectMultipleProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const dropdownRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentValue = value ?? defaultValue ?? [];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
				containerRef.current?.focus();
			}
		};
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}
	}, [isOpen]);

	const handleToggle = useCallback(() => {
		if (!disabled) setIsOpen(prev => !prev);
	}, [disabled]);

	const filteredOptions = options.filter(option =>
		option.label?.toLowerCase().includes(search.toLowerCase()),
	);

	const handleOptionClick = (optionValue: string) => {
		if (!disabled) {
			const newValue = currentValue.includes(optionValue)
				? currentValue.filter(val => val !== optionValue)
				: [...currentValue, optionValue];
			onChange?.(newValue);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent, optionValue: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleOptionClick(optionValue);
		}
	};

	const selectedLabels = currentValue
		.map(val => options.find(opt => opt.value === val)?.label)
		.filter(Boolean)
		.join(', ');

	return (
		<section
			className={`${styles.select} ${className || ''}`}
			ref={dropdownRef}
			{...props}
		>
			{label && <h2 className={styles.select__label}>{label}</h2>}
			<div
				ref={containerRef}
				className={`${styles.select__container} ${
					error ? styles['select__container--error'] : ''
				}`}
			>
				{iconName && (
					<div className={styles.select__contentIcon}>
						<Icons
							iconName={iconName}
							className={`${styles.select__icon} ${
								error ? styles['select__icon--error'] : ''
							} ${disabled ? styles['select__icon--disabled'] : ''}`}
						/>
					</div>
				)}
				<Button
					variant="theme"
					onClick={handleToggle}
					className={styles.select__btn}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					disabled={disabled}
					icon={{
						iconName: 'arrow',
						className: `${
							styles.select__iconAnimated
						} ${isOpen ? styles['select__iconAnimated--active'] : ''}`,
					}}
				>
					<div className={styles.select__contentValue}>
						{currentValue.length > 0 ? (
							<span
								className={`${styles.select__value} ${
									!iconName ? styles['select__value--noIcon'] : ''
								}`}
							>
								{selectedLabels}
							</span>
						) : (
							<span
								className={`${styles.select__value} ${
									styles['select__value--placeholder']
								} ${!iconName ? styles['select__value--noIcon'] : ''}`}
							>
								{placeholder}
							</span>
						)}
					</div>
				</Button>
			</div>

			<div
				role="listbox"
				className={`${styles.select__dropdown} ${
					isOpen ? styles['select__dropdown--open'] : ''
				}`}
				aria-hidden={!isOpen}
				aria-multiselectable="true"
			>
				{enableSearch && (
					<div className={styles.select__search}>
						<input
							type="search"
							placeholder="Buscar..."
							value={search}
							onChange={e => setSearch(e.target.value)}
							className={styles.select__searchInput}
						/>
					</div>
				)}

				<ul className={styles.select__menu} role="options">
					{filteredOptions.length > 0 ? (
						filteredOptions.map(option => (
							<li
								key={option.value}
								tabIndex={0}
								role="option"
								onClick={() => handleOptionClick(option.value)}
								onKeyDown={e => handleKeyDown(e, option.value)}
								className={`${styles.select__option} ${
									currentValue.includes(option.value)
										? styles['select__option--selected']
										: ''
								}`}
								aria-selected={currentValue.includes(option.value)}
							>
								<span>{option.label}</span>
								<Icons
									iconName={
										currentValue.includes(option.value)
											? 'checkBoxOn'
											: 'checkBoxOff'
									}
									className={`${styles.select__optionIcon} ${
										styles['select__optionIcon--visible']
									}`}
								/>
							</li>
						))
					) : (
						<li className={styles.select__option} aria-disabled="true">
							<span>No se encontraron resultados</span>
						</li>
					)}
				</ul>
			</div>

			{error && (
				<span className={styles.select__error}>
					{renderErrorMessage(error?.message)}
				</span>
			)}
		</section>
	);
};

export { SelectInput as Select, SelectMultiple };
export default SelectInput;
