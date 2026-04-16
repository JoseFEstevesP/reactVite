import { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import type { NameIcon } from '../../components/icon/types';
import type { TypeInput } from '../../components/input/types';

export interface ValueAll {
	value: string;
	label: string;
}

export interface UseRenderInputsType<T> {
	register?: UseFormRegister<T>;
	errors?: FieldErrors<T>;
	control?: Control<T>;
	btnDisabled?: boolean;
}

export interface RenderInputType {
	name: string;
	placeholder?: string;
	label?: string;
	type?: TypeInput;
	className?: string;
	iconName?: NameIcon;
	disabled?: boolean;
}

export interface RenderInputFileType {
	name: string;
	placeholder?: string;
	label?: string;
	type?: TypeInput;
	className?: string;
	iconName?: string;
	disabled?: boolean;
}

export interface RenderSelectType {
	name: string;
	placeholder?: string;
	options: ValueAll[];
	label?: string;
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	iconName?: NameIcon;
}

export interface RenderSelectMultipleType {
	name: string;
	placeholder?: string;
	options: ValueAll[];
	label?: string;
	className?: string;
	defaultValue?: string[];
	disabled?: boolean;
	iconName?: NameIcon;
}
