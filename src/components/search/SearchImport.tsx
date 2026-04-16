import { useCallback, useId } from 'react';
import { Button } from '../button/Button';
import styles from './styles.module.scss';
import type { SearchInputProps } from './types';

const SearchImport = ({
	value,
	onChange,
	placeholder = 'Buscar...',
	className,
	disabled = false,
}: SearchInputProps) => {
	const id = useId();

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(e.target.value);
		},
		[onChange],
	);

	return (
		<div
			className={`${styles.search__inputContainer} ${
				styles['search__inputContainer--borderBottom']
			} ${className || ''}`}
		>
			<input
				id={id}
				type="search"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className={styles.search__input}
				disabled={disabled}
			/>
			<Button
				type="button"
				className={styles.search__btn}
				disabled={disabled}
				icon={{
					iconName: 'search',
					className: styles.search__icon,
				}}
			/>
		</div>
	);
};

export default SearchImport;
