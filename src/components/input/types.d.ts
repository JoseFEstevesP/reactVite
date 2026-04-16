import type { UseFormRegister } from 'react-hook-form';
import type { NameIcon } from '../icon/types';

export type ErrorInput =
	| {
			message: string;
			type?: string;
	  }
	| undefined;

export type TypeInput =
	| 'text'
	| 'number'
	| 'search'
	| 'date'
	| 'email'
	| 'password'
	| 'file'
	| 'tel'
	| 'url';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	placeholder?: string;
	error?: ErrorInput;
	className?: string;
	type?: TypeInput;
	label?: string;
	iconName?: NameIcon;
	size?: InputSize;
	fullWidth?: boolean;
	register?: UseFormRegister<Record<string, unknown>>;
}
