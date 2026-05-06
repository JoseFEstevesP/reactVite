import type { NameIcon } from '../icon/types';

export interface CheckboxProps {
	name?: string;
	checked?: boolean;
	onChange?: (value: boolean) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
	checkedIcon?: NameIcon;
}
