import { useMemo } from 'react';
import styles from './styles.module.scss';
import type { PieChartProps } from './types.d';

const DEFAULT_COLORS = [
	'#2563eb',
	'#059669',
	'#d97706',
	'#dc2626',
	'#7c3aed',
	'#db2777',
	'#0891b2',
	'#65a30d',
];

const createArcPath = (
	startAngle: number,
	endAngle: number,
	radius: number,
	innerRadius: number = 0,
): string => {
	const startAngleRad = (startAngle * Math.PI) / 180;
	const endAngleRad = (endAngle * Math.PI) / 180;

	const x1 = Math.cos(startAngleRad) * radius;
	const y1 = Math.sin(startAngleRad) * radius;
	const x2 = Math.cos(endAngleRad) * radius;
	const y2 = Math.sin(endAngleRad) * radius;

	const x3 = Math.cos(endAngleRad) * innerRadius;
	const y3 = Math.sin(endAngleRad) * innerRadius;
	const x4 = Math.cos(startAngleRad) * innerRadius;
	const y4 = Math.sin(startAngleRad) * innerRadius;

	const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

	if (innerRadius === 0) {
		return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
	}

	return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
};

const PieChart = ({
	data,
	showValues = true,
	animated = true,
	className,
	donut = false,
	donutHoleSize = 50,
}: PieChartProps) => {
	const processedData = useMemo(() => {
		const total = data.reduce((acc, item) => acc + item.value, 0);
		if (total === 0) return [];

		let currentAngle = 0;
		return data.map((item, index) => {
			const percentage = (item.value / total) * 100;
			const angle = (item.value / total) * 360;
			const startAngle = currentAngle;
			const endAngle = currentAngle + angle;
			currentAngle = endAngle;

			return {
				...item,
				percentage,
				startAngle,
				endAngle,
				color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
			};
		});
	}, [data]);

	const total = useMemo(
		() => data.reduce((acc, item) => acc + item.value, 0),
		[data],
	);

	const centerValue = useMemo(() => {
		if (donut) {
			return { value: total, label: 'Total' };
		}
		return null;
	}, [donut, total]);

	const radius = 100;
	const innerRadius = donut ? radius * (donutHoleSize / 100) : 0;

	if (!processedData.length) {
		return (
			<div className={`${styles.pieChart} ${className || ''}`}>
				<div className={styles.pieChart__empty}>No hay datos disponibles</div>
			</div>
		);
	}

	return (
		<div
			className={`${styles.pieChart} ${className || ''}`}
			role="img"
			aria-label="Gráfico circular"
		>
			<div className={styles.pieChart__container}>
				<div className={styles.pieChart__chart}>
					<svg viewBox="-120 -120 240 240" className={styles.pieChart__svg}>
						{processedData.map((item, index) => (
							<path
								key={`slice-${index}`}
								d={createArcPath(
									item.startAngle,
									item.endAngle,
									radius,
									innerRadius,
								)}
								style={{ '--slice-color': item.color } as React.CSSProperties}
								className={`${styles.pieChart__slice} ${animated ? styles['pieChart__slice--animated'] : ''}`}
								role="graphics-symbol"
								aria-label={`${item.label}: ${item.value} (${item.percentage.toFixed(1)}%)`}
							/>
						))}
					</svg>
					{centerValue && (
						<div className={styles.pieChart__center}>
							<span className={styles.pieChart__centerValue}>
								{showValues ? total : ''}
							</span>
							<span className={styles.pieChart__centerLabel}>
								{centerValue.label}
							</span>
						</div>
					)}
				</div>
				<div className={styles.pieChart__labels}>
					{processedData.map((item, index) => (
						<div key={`label-${index}`} className={styles.pieChart__labelItem}>
							<span
								className={styles.pieChart__labelColor}
								style={{ backgroundColor: item.color }}
							/>
							<span className={styles.pieChart__labelText}>{item.label}</span>
							<span className={styles.pieChart__labelValue}>
								{showValues ? item.value : `${item.percentage.toFixed(1)}%`}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

PieChart.styles = styles;

export default PieChart;
