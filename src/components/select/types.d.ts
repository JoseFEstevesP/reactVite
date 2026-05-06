import type { FieldValues } from 'react-hook-form';
import type { NameIcon } from '../icon/types';
import type { ErrorInput } from '../input/types';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps<T extends FieldValues = FieldValues> {
	name: string;
	control?: Control<T>;
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

export interface SelectMultipleProps<T extends FieldValues = FieldValues> {
	name: string;
	control?: Control<T>;
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
