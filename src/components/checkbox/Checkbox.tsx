import { Icons } from '../icon/Icons';
import style from './styles.module.scss';
import type { CheckboxProps } from './types';

const Checkbox = ({
	name,
	checked = false,
	onChange,
	label,
	disabled = false,
	className = '',
	checkedIcon = 'checkBoxOn',
}: CheckboxProps) => {
	const handleClick = () => {
		if (!disabled && onChange) {
			onChange(!checked);
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
				checked={checked}
				onChange={handleClick}
				disabled={disabled}
				className={style.checkbox__input}
			/>
			<span
				className={`
					${style.checkbox__box}
					${checked ? style['checkbox__box--checked'] : ''}
					${disabled ? style['checkbox__box--disabled'] : ''}
				`}
				onKeyDown={handleKeyDown}
				role="checkbox"
				aria-checked={checked}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
			>
				{checked && (
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
