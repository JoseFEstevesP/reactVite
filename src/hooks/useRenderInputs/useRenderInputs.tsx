import { type FieldValues } from 'react-hook-form';
import { Input } from '../../components/input/Input';
import type { ErrorInput } from '../../components/input/types';
import { Select, SelectMultiple } from '../../components/select/Select';
import type {
	RenderInputType,
	RenderSelectMultipleType,
	RenderSelectType,
	UseRenderInputsType,
} from './useRenderInputsType';

const useRenderInputs = <T extends FieldValues>(
	props?: UseRenderInputsType<T>,
) => {
	const errors = props?.errors;
	const renderInput = ({
		name,
		placeholder,
		label,
		type = 'text',
		className,
		iconName,
		disabled,
	}: RenderInputType) => {
		const error = errors ? (errors[name as keyof T] as ErrorInput) : undefined;

		return (
			<Input
				name={name}
				placeholder={placeholder}
				type={type}
				error={error}
				label={label}
				className={className}
				iconName={iconName}
				disabled={disabled}
			/>
		);
	};

	const renderSelect = ({
		name,
		placeholder,
		options,
		label,
		className,
		defaultValue,
		disabled,
		iconName,
	}: RenderSelectType) => {
		const error = errors ? (errors[name as keyof T] as ErrorInput) : undefined;

		return (
			<Select
				name={name}
				options={options}
				error={error}
				label={label}
				className={className}
				defaultValue={defaultValue}
				disabled={disabled}
				enableSearch={options.length > 5}
				iconName={iconName}
				placeholder={placeholder}
			/>
		);
	};

	const renderSelectMultiple = ({
		name,
		placeholder,
		options,
		label,
		className,
		defaultValue,
		disabled,
		iconName,
	}: RenderSelectMultipleType) => {
		const error = errors ? (errors[name as keyof T] as ErrorInput) : undefined;

		return (
			<SelectMultiple
				name={name}
				options={options}
				error={error}
				label={label}
				className={className}
				defaultValue={defaultValue}
				disabled={disabled}
				enableSearch={options.length > 5}
				iconName={iconName}
				placeholder={placeholder}
			/>
		);
	};

	return { renderInput, renderSelect, renderSelectMultiple };
};

export default useRenderInputs;
