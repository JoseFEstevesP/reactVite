import type { UseFormRegister, Control, FieldValues } from 'react-hook-form';
import type { ErrorInput } from '@/components/input/types';

export type CurrencySymbol = '$' | 'BS' | 'Bs.' | '\u20AC';

export interface CurrencyConfig {
	symbol: CurrencySymbol;
	thousandSeparator: string;
	decimalSeparator: string;
	decimalPlaces: number;
}

export const currencyConfigs: Record<CurrencySymbol, CurrencyConfig> = {
	$: {
		symbol: '$',
		thousandSeparator: ',',
		decimalSeparator: '.',
		decimalPlaces: 2,
	},
	BS: {
		symbol: 'BS',
		thousandSeparator: '.',
		decimalSeparator: ',',
		decimalPlaces: 2,
	},
	'Bs.': {
		symbol: 'Bs.',
		thousandSeparator: '.',
		decimalSeparator: ',',
		decimalPlaces: 2,
	},
	'\u20AC': {
		symbol: '\u20AC',
		thousandSeparator: '.',
		decimalSeparator: ',',
		decimalPlaces: 2,
	},
};

export const currencyOptions = [
	{ value: '$', label: '$' },
	{ value: 'BS', label: 'BS' },
	{ value: 'Bs.', label: 'Bs.' },
	{ value: '\u20AC', label: '\u20AC' },
];

export interface RenderCurrencyType {
	name: string;
	nameCurrency?: string;
	label?: string;
	placeholder?: string;
	className?: string;
	defaultValue?: string;
	defaultCurrency?: CurrencySymbol;
	max?: number;
	disabled?: boolean;
}

export interface CurrencyInputProps<T extends FieldValues>
	extends RenderCurrencyType {
	register?: UseFormRegister<T>;
	control?: Control<T>;
	error?: ErrorInput;
	currencyError?: ErrorInput;
}
