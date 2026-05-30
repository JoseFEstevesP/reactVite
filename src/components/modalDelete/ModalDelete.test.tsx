import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalDelete from './ModalDelete';

vi.mock('@/components/modal/Modal', () => ({
	default: ({
		children,
		isOpen,
		onClose,
	}: {
		children: React.ReactNode;
		isOpen: boolean;
		onClose: () => void;
	}) => (
		<div data-testid="modal" data-open={isOpen}>
			<button data-testid="modal-close" type="button" onClick={onClose}>
				close
			</button>
			{children}
		</div>
	),
}));

vi.mock('@/components/button/Button', () => ({
	Button: ({
		children,
		onClick,
		variant,
		disabled,
	}: {
		children?: React.ReactNode;
		onClick?: () => void;
		variant?: string;
		disabled?: boolean;
	}) => (
		<button
			data-testid={`button-${variant}`}
			type="button"
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	),
}));

describe('ModalDelete', () => {
	const defaultProps = {
		isOpen: true,
		handleClose: vi.fn(),
		itemName: 'John Doe',
		selectedUid: 'abc123',
		isDeleting: false,
		handleDelete: vi.fn(),
		itemLabel: 'usuario',
	};

	it('renders with item label and name', () => {
		render(<ModalDelete {...defaultProps} />);
		expect(screen.getByText(/eliminar este usuario/i)).toBeInTheDocument();
		expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
	});

	it('renders with default label when not provided', () => {
		const { itemLabel: _, ...rest } = defaultProps;
		render(<ModalDelete {...rest} />);
		expect(screen.getByText(/eliminar este elemento/i)).toBeInTheDocument();
	});

	it('calls handleClose when cancel is clicked', () => {
		render(<ModalDelete {...defaultProps} />);
		fireEvent.click(screen.getByText('Cancelar'));
		expect(defaultProps.handleClose).toHaveBeenCalled();
	});

	it('calls handleDelete when delete is clicked', () => {
		render(<ModalDelete {...defaultProps} />);
		fireEvent.click(screen.getByText('Eliminar'));
		expect(defaultProps.handleDelete).toHaveBeenCalled();
	});

	it('does not render delete button when selectedUid is empty', () => {
		render(<ModalDelete {...defaultProps} selectedUid="" />);
		expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
	});

	it('disables delete button when isDeleting is true', () => {
		render(<ModalDelete {...defaultProps} isDeleting />);
		expect(screen.getByText('Eliminar')).toBeDisabled();
	});

	it('does not render modal content when isOpen is false', () => {
		render(<ModalDelete {...defaultProps} isOpen={false} />);
		expect(screen.getByTestId('modal')).toHaveAttribute('data-open', 'false');
	});
});
