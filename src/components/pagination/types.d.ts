import type { ReactNode } from 'react';

export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps {
	pages: number;
	currentPage: number;
	onPageChange: (value: number) => void;
	size?: PaginationSize;
	showFirstLast?: boolean;
	maxButtons?: number;
	prevIcon?: ReactNode;
	nextIcon?: ReactNode;
	firstIcon?: ReactNode;
	lastIcon?: ReactNode;
}
