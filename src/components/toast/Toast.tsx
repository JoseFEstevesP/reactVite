import styles from './styles.module.scss';

interface ToastProps {
	id: string;
	message: string;
	type: 'success' | 'error';
	onClose: () => void;
}

export const Toast = ({ id: _id, message, type, onClose }: ToastProps) => {
	return (
		<div className={`${styles.toast} ${styles[type]}`}>
			<span className={styles.message}>{message}</span>
			<button className={styles.close} onClick={onClose} type="button">
				×
			</button>
		</div>
	);
};

export default Toast;
