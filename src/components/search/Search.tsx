import { useCallback, useId, useState } from 'react';
import { Button } from '../button/Button';
import { renderErrorMessage } from '../input/renderErrorMessage';
import styles from './styles.module.scss';
import type { SearchProps } from './types';

const Search = ({
	value,
	onChange,
	onSubmit,
	placeholder = 'Buscar...',
	error,
	className,
	label,
	id: providedId,
	disabled = false,
	minLength,
	maxLength,
	autoComplete,
	...props
}: SearchProps) => {
	const generatedId = useId();
	const id = providedId || generatedId;
	const [inputValue, setInputValue] = useState(value ?? '');

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setInputValue(newValue);
			onChange?.(newValue);
		},
		[onChange],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const searchValue = inputValue.trim();
			if (onSubmit) {
				onSubmit(searchValue);
			} else {
				onChange?.(searchValue);
			}
		},
		[onChange, onSubmit, inputValue],
	);

	return (
		<form
			role="search"
			className={`${styles.search} ${className || ''}`}
			onSubmit={handleSubmit}
			{...props}
		>
			{label && (
				<label htmlFor={id} className={styles.search__label}>
					{label}
				</label>
			)}
			<div
				className={`${styles.search__container} ${
					error ? styles['search__container--error'] : ''
				} ${disabled ? styles['search__container--disabled'] : ''}`}
			>
				<div className={styles.search__inputContainer}>
					<input
						id={id}
						type="search"
						value={inputValue}
						onChange={handleChange}
						placeholder={placeholder}
						className={styles.search__input}
						disabled={disabled}
						aria-invalid={error ? 'true' : 'false'}
						aria-describedby={error ? `${id}-error` : undefined}
						minLength={minLength}
						maxLength={maxLength}
						autoComplete={autoComplete}
					/>
				</div>
				<Button
					variant="ghost"
					type="submit"
					className={styles.search__btn}
					disabled={disabled}
					icon={{
						iconName: 'search',
						className: styles.search__icon,
					}}
				/>
			</div>
			{error && (
				<span id={`${id}-error`} className={styles.search__error}>
					{renderErrorMessage(error.message)}
				</span>
			)}
		</form>
	);
};

export default Search;
