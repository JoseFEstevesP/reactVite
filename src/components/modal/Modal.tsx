import { useEffect, useRef } from 'react';
import { Icons } from '../icon/Icons';
import style from './styles.module.scss';
import type { ModalProps } from './types';

const Modal = ({
	className = '',
	children,
	footer,
	isOpen,
	onClose,
	size = 'md',
	title,
}: ModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (isOpen) {
			previousFocusRef.current = document.activeElement as HTMLElement;
			dialogRef.current?.showModal();
			dialogRef.current?.focus();
			document.body.style.overflow = 'hidden';
		} else {
			dialogRef.current?.close();
			previousFocusRef.current?.focus();
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				e.preventDefault();
				onClose?.();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === dialogRef.current) {
			onClose?.();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			className={`${className} ${style.modal}`}
			data-state={isOpen ? 'open' : 'closed'}
			onClick={handleBackdropClick}
		>
			<div
				className={`${style.modal__content} ${style[`modal__content--${size}`]}`}
			>
				<div className={style.modal__header}>
					{title && <h2 className={style.modal__title}>{title}</h2>}
					<button
						className={style.modal__closeBtn}
						onClick={onClose}
						aria-label="Close modal"
						type="button"
					>
						<Icons iconName="close" className={style.modal__icon} />
					</button>
				</div>
				<div className={style.modal__children}>{children}</div>
				{footer && <div className={style.modal__footer}>{footer}</div>}
			</div>
		</dialog>
	);
};
export default Modal;
