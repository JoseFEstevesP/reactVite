import React from 'react';
import useRenderInputs from '@/hooks/useRenderInputs/useRenderInputs';
import type {
	ValueAll,
	CurrencySymbol,
} from '@/hooks/useRenderInputs/useRenderInputsType';
import LForm from '@/layout/form/LForm';
import type {
	Control,
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';
import type { NameIcon } from '../icon/types';
import type { TypeInput } from '../input/types';

type FormInputField = {
	type: 'input';
	name: string;
	placeholder?: string;
	label?: string;
	inputType?: TypeInput;
	className?: string;
	iconName?: NameIcon;
	disabled?: boolean;
};

type FormSelectField = {
	type: 'select';
	name: string;
	placeholder?: string;
	options: ValueAll[];
	label?: string;
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	iconName?: NameIcon;
};

type FormSelectMultipleField = {
	type: 'selectMultiple';
	name: string;
	placeholder?: string;
	options: ValueAll[];
	label?: string;
	className?: string;
	defaultValue?: string[];
	disabled?: boolean;
	iconName?: NameIcon;
};

type FormCurrencyField = {
	type: 'currency';
	name: string;
	nameCurrency?: string;
	placeholder?: string;
	label?: string;
	className?: string;
	defaultValue?: string;
	defaultCurrency?: CurrencySymbol;
	max?: number;
	disabled?: boolean;
};

type FormField =
	| FormInputField
	| FormSelectField
	| FormSelectMultipleField
	| FormCurrencyField;

interface FormProps<T extends FieldValues> {
	title: string;
	onSubmit: () => void;
	theme?: boolean;
	size?: 'sm' | 'md';
	register?: UseFormRegister<T>;
	errors?: FieldErrors<T>;
	control?: Control<T>;
	renderOptions: FormField[];
}

const Form = <T extends FieldValues>({
	title,
	theme = false,
	size = 'md',
	onSubmit,
	control,
	errors,
	register,
	renderOptions = [],
}: FormProps<T>) => {
	const { renderInput, renderSelect, renderSelectMultiple, renderCurrency } =
		useRenderInputs({
			register,
			control,
			errors,
		});

	return (
		<LForm title={title} theme={theme} size={size} onSubmit={onSubmit}>
			{renderOptions.map((field, index) => {
				if (field.type === 'input') {
					const { type: _type, inputType, ...inputProps } = field;
					return (
						<React.Fragment key={`${field.type}-${index}`}>
							{renderInput({ ...inputProps, type: inputType })}
						</React.Fragment>
					);
				} else if (field.type === 'select') {
					const { type: _type, ...selectProps } = field;
					return (
						<React.Fragment key={`${field.type}-${selectProps.name}`}>
							{renderSelect(selectProps)}
						</React.Fragment>
					);
				} else if (field.type === 'selectMultiple') {
					const { type: _type, ...selectMultipleProps } = field;
					return (
						<React.Fragment key={`${field.type}-${selectMultipleProps.name}`}>
							{renderSelectMultiple(selectMultipleProps)}
						</React.Fragment>
					);
				} else if (field.type === 'currency') {
					const { type: _type, ...currencyProps } = field;
					return (
						<React.Fragment key={`${field.type}-${currencyProps.name}`}>
							{renderCurrency(currencyProps)}
						</React.Fragment>
					);
				}
			})}
		</LForm>
	);
};
export default Form;
