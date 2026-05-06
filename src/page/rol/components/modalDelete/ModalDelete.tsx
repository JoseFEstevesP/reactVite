import { Button } from '@/components/button/Button';
import Modal from '@/components/modal/Modal';
import styles from './styles.module.scss';

interface ModalDeleteProps {
	isOpen: boolean;
	handleClose: () => void;
	rolName: string;
	selectedUid: string;
	isDeleting: boolean;
	handleDelete: () => void;
}

const ModalDelete = ({
	isOpen,
	handleClose,
	rolName,
	selectedUid,
	handleDelete,
	isDeleting,
}: ModalDeleteProps) => {
	return (
		<>
			<Modal isOpen={isOpen} onClose={handleClose} className={styles.modal}>
				<section className={styles.modal__content}>
					<h2 className={styles.modal__title}>
						¿Estás seguro de que quieres eliminar este rol?
					</h2>
					<p className={styles.modal__message}>
						Esta acción no se puede deshacer. El rol <strong>{rolName}</strong>{' '}
						se eliminará permanentemente.
					</p>
					<div className={styles.modal__actions}>
						<Button onClick={handleClose} variant="secondary">
							Cancelar
						</Button>
						{selectedUid && (
							<Button
								onClick={handleDelete}
								variant="danger"
								disabled={isDeleting}
							>
								Eliminar
							</Button>
						)}
					</div>
				</section>
			</Modal>
		</>
	);
};
export default ModalDelete;
