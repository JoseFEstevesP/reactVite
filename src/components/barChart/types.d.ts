export interface BarChartData {
	label: string;
	value: number;
	color?: string;
}

export interface BarChartProps {
	data: BarChartData[];
	maxValue?: number;
	showValues?: boolean;
	animated?: boolean;
	className?: string;
}
