import type { ReactNode } from 'react';

export interface ModalProps {
	children: ReactNode;
	className?: string;
	footer?: ReactNode;
	isOpen: boolean;
	onClose?: () => void;
	size?: 'sm' | 'md' | 'lg';
	title?: string;
}

export interface UseModalProps {
	initState?: boolean;
}

export interface UseModalReturn {
	isOpen: boolean;
	handleOpen: () => void;
	handleClose: () => void;
	setIsOpen: (value: boolean) => void;
}
