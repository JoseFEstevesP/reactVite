import { useToastStore } from '@/stores/toastStore';
import { Toast } from './Toast';
import styles from './container.module.scss';

export const ToastContainer = () => {
	const { toasts, removeToast } = useToastStore();

	if (toasts.length === 0) return null;

	return (
		<div className={styles.container}>
			{toasts.map(toast => (
				<Toast
					key={toast.id}
					id={toast.id}
					message={toast.message}
					type={toast.type}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</div>
	);
};

export default ToastContainer;
