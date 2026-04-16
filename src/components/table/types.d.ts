import type { ReactNode } from 'react';
import type { PaginationProps } from '../pagination/types';

export type ColumnAlign = 'left' | 'center' | 'right';

export interface Column<T> {
	key: keyof T;
	label: string;
	align?: ColumnAlign;
	sortable?: boolean;
	render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface TableProps<T> {
	columns: Column<T>[];
	data: T[];
	currentPage: number;
	totalPages: number;
	onPageChange: (value: number) => void;
	onRowClick?: (row: T) => void;
	sortColumn?: keyof T | null;
	sortDirection?: 'asc' | 'desc';
	onSort?: (column: keyof T) => void;
	loading?: boolean;
	emptyMessage?: string;
	pagination?: Omit<PaginationProps, 'pages' | 'currentPage' | 'onPageChange'>;
}
