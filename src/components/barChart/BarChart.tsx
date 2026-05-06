import { useMemo } from 'react';
import styles from './styles.module.scss';
import type { BarChartProps } from './types.d';

const BarChart = ({
	data,
	maxValue,
	showValues = true,
	animated = true,
	className,
}: BarChartProps) => {
	const calculatedMax = useMemo(() => {
		if (maxValue) return maxValue;
		const max = Math.max(...data.map(d => d.value), 0);
		return max === 0 ? 100 : max * 1.1;
	}, [data, maxValue]);

	const getBarHeight = (value: number) => {
		if (calculatedMax === 0) return 0;
		return (value / calculatedMax) * 100;
	};

	const hasColors = data.some(d => d.color);

	if (!data || data.length === 0) {
		return (
			<div className={`${styles.barChart} ${className || ''}`}>
				<div className={styles.barChart__empty}>No hay datos disponibles</div>
			</div>
		);
	}

	return (
		<div
			className={`${styles.barChart} ${className || ''}`}
			role="img"
			aria-label="Gráfico de barras"
		>
			<div className={styles.barChart__container}>
				<div className={styles.barChart__bars}>
					{data.map((item, index) => {
						const barHeight = getBarHeight(item.value);
						const barColor = item.color || 'var(--bar-chart-bar)';

						return (
							<div key={`bar-${index}`} className={styles.barChart__barWrapper}>
								<div
									className={`${styles.barChart__bar} ${animated ? styles['barChart__bar--animated'] : ''}`}
									style={{
										height: `${barHeight}%`,
										backgroundColor: barColor,
										animationDelay: `${index * 0.1}s`,
									}}
									role="graphics-symbol"
									aria-label={`${item.label}: ${item.value}`}
								>
									{showValues && barHeight > 15 && (
										<span
											className={`${styles.barChart__value} ${styles['barChart__value--inside']}`}
										>
											{item.value}
										</span>
									)}
								</div>
								<span className={styles.barChart__label}>{item.label}</span>
							</div>
						);
					})}
				</div>
				{hasColors && (
					<div className={styles.barChart__legend}>
						{data.map(
							(item, index) =>
								item.color && (
									<div
										key={`legend-${index}`}
										className={styles.barChart__legendItem}
									>
										<span
											className={styles.barChart__legendColor}
											style={{ backgroundColor: item.color }}
										/>
										<span>{item.label}</span>
									</div>
								),
						)}
					</div>
				)}
			</div>
		</div>
	);
};

BarChart.styles = styles;

export default BarChart;
