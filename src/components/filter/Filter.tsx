import { LimitFetchData } from '@/enums/limit';
import { OrderEnum } from '@/enums/order';
import { transformEnum } from '@/functions/transformEnum/transformEnum';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../button/Button';
import { Select } from '../select/Select';
import type { FilterDataDTOType } from './dto/filterDataDTO';
import style from './styles.module.scss';

interface OrderConfig {
	OrderProperty: Record<string, string>;
	defaultOrderProperty: string;
	textOrderProperty: Record<string, string>;
}

export interface CustomSelectConfig {
	name: keyof FilterDataDTOType | (string & {});
	label: string;
	options: Record<string, string>;
	textOptions?: Record<string, string>;
	withAllOption?: boolean;
	allOptionLabel?: string;
}

export interface FilterProps {
	className?: string;
	orderConfig: OrderConfig;
	customSelects?: CustomSelectConfig[];
	onFilter: (data: FilterDataDTOType) => void;
	onReset: () => void;
	initialData?: FilterDataDTOType;
}

const Filter = ({
	className = '',
	orderConfig,
	customSelects = [],
	onFilter,
	onReset,
	initialData,
}: FilterProps) => {
	const defaultValues = useMemo(
		() => ({
			orderProperty: orderConfig.defaultOrderProperty,
			order: OrderEnum.ASC,
			limit: LimitFetchData['d-20'],
			...customSelects.reduce<Record<string, string>>((acc, select) => {
				acc[select.name] = '';
				return acc;
			}, {}),
		}),
		[orderConfig.defaultOrderProperty, customSelects],
	);

	const { handleSubmit, watch, setValue, reset, control } =
		useForm<FilterDataDTOType>({
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
					control={control}
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
					control={control}
					name="orderProperty"
					value={orderPropertyValue}
					onChange={value => setValue('orderProperty', value)}
					options={orderPropertyOptions}
					placeholder="Ordenar por"
				/>
			</div>
			<div className={style.filter__selectWrapper}>
				<Select
					control={control}
					name="limit"
					value={limitValue}
					onChange={value =>
						setValue('limit', value as FilterDataDTOType['limit'])
					}
					options={limitOptions}
					placeholder="Límite"
				/>
			</div>
			{customSelects.map(config => {
				const allOption = config.withAllOption
					? [
							{
								value: '',
								label: config.allOptionLabel || 'Todo',
							},
						]
					: [];

				const options = [
					...allOption,
					...transformEnum({
						transformEnum: config.options,
						text: config.textOptions,
					}),
				];

				return (
					<div className={style.filter__selectWrapper} key={config.name}>
						<Select
							control={control}
							name={config.name as string}
							value={watch(config.name as keyof FilterDataDTOType) as string}
							onChange={value =>
								setValue(config.name as keyof FilterDataDTOType, value)
							}
							options={options}
							placeholder={config.label}
						/>
					</div>
				);
			})}
			<div className={style.filter__btnWrapper}>
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
			</div>
		</form>
	);
};

export default Filter;
