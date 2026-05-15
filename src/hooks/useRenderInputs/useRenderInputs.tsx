import { type FieldValues, type Control } from 'react-hook-form';
import { Input } from '../../components/input/Input';
import type { ErrorInput } from '../../components/input/types';
import { Select, SelectMultiple } from '../../components/select/Select';
import { CurrencyInput } from '../../components/currency/CurrencyInput';
import type {
	RenderInputType,
	RenderSelectMultipleType,
	RenderSelectType,
	RenderCurrencyType,
	UseRenderInputsType,
} from './useRenderInputsType';

const useRenderInputs = <T extends FieldValues>(
	props?: UseRenderInputsType<T>,
) => {
	const { register, control, errors } = props ?? {};

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
				register={register}
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
				control={control}
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
				control={control}
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

	const renderCurrency = ({
		name,
		nameCurrency,
		label,
		placeholder,
		defaultValue,
		defaultCurrency,
		max,
		disabled,
	}: RenderCurrencyType) => {
		const fieldError = errors ? (errors[name as keyof T] as ErrorInput) : undefined;

		return (
			<CurrencyInput<T>
				name={name}
				nameCurrency={nameCurrency}
				label={label}
				placeholder={placeholder}
				defaultValue={defaultValue}
				defaultCurrency={defaultCurrency}
				error={fieldError}
				max={max}
				disabled={disabled}
				control={control as Control<T>}
			/>
		);
	};

	return { renderInput, renderSelect, renderSelectMultiple, renderCurrency };
};

export default useRenderInputs;
