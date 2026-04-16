import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../button/Button';
import { Select } from '../select/Select';
import { transformEnum } from '@/functions/transformEnum/transformEnum';
import { LimitFetchData } from '@/enums/limit';
import { OrderEnum } from '@/enums/order';
import type { FilterDataDTOType } from './dto/filterDataDTO';
import style from './styles.module.scss';

interface OrderConfig {
	OrderProperty: Record<string, string>;
	defaultOrderProperty: string;
	textOrderProperty: Record<string, string>;
}

export interface FilterProps {
	className?: string;
	orderConfig: OrderConfig;
	onFilter: (data: FilterDataDTOType) => void;
	onReset: () => void;
	initialData?: FilterDataDTOType;
}

const Filter = ({
	className = '',
	orderConfig,
	onFilter,
	onReset,
	initialData,
}: FilterProps) => {
	const defaultValues = useMemo(
		() => ({
			orderProperty: orderConfig.defaultOrderProperty,
			order: OrderEnum.ASC,
			limit: LimitFetchData['d-20'],
		}),
		[orderConfig.defaultOrderProperty],
	);

	const { handleSubmit, watch, setValue, reset } = useForm<FilterDataDTOType>({
		defaultValues: initialData || defaultValues,
	});

	const orderValue = watch('order') || OrderEnum.ASC;
	const orderPropertyValue =
		watch('orderProperty') || orderConfig.defaultOrderProperty;
	const limitValue = watch('limit') || LimitFetchData['d-20'];

	const orderOptions = transformEnum({ transformEnum: OrderEnum });
	const orderPropertyOptions = transformEnum({
		transformEnum: orderConfig.OrderProperty,
		text: orderConfig.textOrderProperty,
	});
	const limitOptions = transformEnum({ transformEnum: LimitFetchData });

	const handleReset = useCallback(() => {
		reset(defaultValues);
		onReset();
	}, [defaultValues, reset, onReset]);

	return (
		<form
			onSubmit={handleSubmit(onFilter)}
			className={`${style.filter} ${className}`}
		>
			<div className={style.filter__selectWrapper}>
				<Select
					name="order"
					value={orderValue}
					onChange={value =>
						setValue('order', value as FilterDataDTOType['order'])
					}
					options={orderOptions}
					placeholder="Orden"
				/>
			</div>
			<div className={style.filter__selectWrapper}>
				<Select
					name="orderProperty"
					value={orderPropertyValue}
					onChange={value => setValue('orderProperty', value)}
					options={orderPropertyOptions}
					placeholder="Ordenar por"
				/>
			</div>
			<div className={style.filter__selectWrapper}>
				<Select
					name="limit"
					value={limitValue}
					onChange={value =>
						setValue('limit', value as FilterDataDTOType['limit'])
					}
					options={limitOptions}
					placeholder="Límite"
				/>
			</div>
			<Button
				type="submit"
				icon={{ iconName: 'filter' }}
				className={style.filter__btn}
				title="Aplicar filtro"
			/>
			<Button
				type="button"
				onClick={handleReset}
				icon={{ iconName: 'filterOff' }}
				className={style.filter__btn}
				title="Resetear filtro"
			/>
		</form>
	);
};

export default Filter;
