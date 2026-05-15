import type { CurrencySymbol } from '@/components/currency/types';
import { currencyConfigs } from '@/components/currency/types';

export function formatAmount(amount: number | string, typeMoney: string) {
	const num = Number(amount);
	if (Number.isNaN(num)) return `${typeMoney} 0.00`;
	const cfg = currencyConfigs[typeMoney as CurrencySymbol];
	if (!cfg) {
		return `${typeMoney} ${num.toFixed(2)}`;
	}
	const [intPart, decPart = '00'] = num.toFixed(2).split('.');
	const intWithSeparators = intPart.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		cfg.thousandSeparator,
	);
	return `${typeMoney} ${intWithSeparators}${cfg.decimalSeparator}${decPart}`;
}
