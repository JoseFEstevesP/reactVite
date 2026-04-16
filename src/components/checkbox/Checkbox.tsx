import { Icons } from '../icon/Icons';
import style from './styles.module.scss';
import type { CheckboxProps } from './types';

const Checkbox = ({
	name,
	value = false,
	onChange,
	label,
	disabled = false,
	className = '',
	checkedIcon = 'checkBoxOn',
}: CheckboxProps) => {
	const handleClick = () => {
		if (!disabled && onChange) {
			onChange(!value);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<label
			className={`${style.checkbox} ${disabled ? style['checkbox__label--disabled'] : ''} ${className}`}
		>
			<input
				type="checkbox"
				name={name}
				checked={value}
				onChange={handleClick}
				disabled={disabled}
				className={style.checkbox__input}
			/>
			<span
				className={`
					${style.checkbox__box}
					${value ? style['checkbox__box--checked'] : ''}
					${disabled ? style['checkbox__box--disabled'] : ''}
				`}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				role="checkbox"
				aria-checked={value}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
			>
				{value && (
					<Icons iconName={checkedIcon} className={style.checkbox__icon} />
				)}
			</span>
			{label && (
				<span
					className={`${style.checkbox__label} ${disabled ? style['checkbox__label--disabled'] : ''}`}
				>
					{label}
				</span>
			)}
		</label>
	);
};

export default Checkbox;
