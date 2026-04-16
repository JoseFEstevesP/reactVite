import type { LinkProps } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { IconParameter } from '../icon/types';

export type LinkVariant = 'primary' | 'secondary' | 'ghost';
export type LinkSize = 'sm' | 'md' | 'lg';

export interface LinkComponentProps extends Omit<LinkProps, 'className'> {
	className?: string;
	icon?: IconParameter;
	size?: LinkSize;
	variant?: LinkVariant;
	children?: ReactNode;
}
