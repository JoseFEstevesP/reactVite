import type { NameIcon } from '../icon/types';
import type { ErrorInput } from '../input/types';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps {
	name: string;
	value?: string;
	onChange?: (value: string) => void;
	label?: string;
	placeholder?: string;
	options: SelectOption[];
	error?: ErrorInput;
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	enableSearch?: boolean;
	iconName?: NameIcon;
}

export interface SelectMultipleProps {
	name: string;
	value?: string[];
	onChange?: (value: string[]) => void;
	label?: string;
	placeholder?: string;
	options: SelectOption[];
	error?: ErrorInput;
	className?: string;
	defaultValue?: string[];
	disabled?: boolean;
	enableSearch?: boolean;
	iconName?: NameIcon;
}
