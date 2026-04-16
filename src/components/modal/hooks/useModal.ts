import { useCallback, useState } from 'react';
import type { UseModalProps, UseModalReturn } from '../types';

export const useModal = ({
	initState = false,
}: UseModalProps = {}): UseModalReturn => {
	const [isOpen, setIsOpen] = useState(initState);

	const handleOpen = useCallback(() => setIsOpen(true), []);
	const handleClose = useCallback(() => setIsOpen(false), []);
	const setIsOpenFn = useCallback((value: boolean) => setIsOpen(value), []);

	return {
		isOpen,
		handleOpen,
		handleClose,
		setIsOpen: setIsOpenFn,
	};
};
