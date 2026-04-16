import type { ErrorInput } from '../input/types';

export interface SearchProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	error?: ErrorInput;
	className?: string;
	label?: string;
	id?: string;
	disabled?: boolean;
	minLength?: number;
	maxLength?: number;
	autoComplete?: string;
}

export interface SearchInputProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}
