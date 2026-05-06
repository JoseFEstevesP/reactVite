export interface PieChartData {
	label: string;
	value: number;
	color?: string;
}

export interface PieChartProps {
	data: PieChartData[];
	showValues?: boolean;
	animated?: boolean;
	className?: string;
	donut?: boolean;
	donutHoleSize?: number;
}
