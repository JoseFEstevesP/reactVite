import { useMarkAsRead, useNotifications } from '@/api/notification/hooks';
import type {
	NotificationResponse,
	NotificationType,
} from '@/api/notification/types';
import { Button } from '@/components/button/Button';
import Loader from '@/components/loader/Loader';
import useValidate from '@/hooks/useValidate';
import { Permission } from '@/page/rol/enum/Permissions';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

const typeLabels: Record<NotificationType, string> = {
	payment_failed: 'Pago fallido',
	payment_success: 'Pago exitoso',
	payment_overdue: 'Pago vencido',
	server_disconnected: 'Servidor desconectado',
	server_connected: 'Servidor conectado',
	system_alert: 'Alerta del sistema',
};

function formatRelativeTime(dateStr: string): string {
	const now = Date.now();
	const date = new Date(dateStr).getTime();
	const diffMs = now - date;
	const diffMin = Math.floor(diffMs / 60000);
	const diffHr = Math.floor(diffMs / 3600000);
	const diffDay = Math.floor(diffMs / 86400000);

	if (diffMin < 1) return 'ahora';
	if (diffMin < 60) return `hace ${diffMin} min`;
	if (diffHr < 24) return `hace ${diffHr} h`;
	if (diffDay < 7) return `hace ${diffDay} d`;
	return new Date(dateStr).toLocaleDateString('es-ES', {
		day: 'numeric',
		month: 'short',
	});
}

const NotificationItem = ({
	notification,
	onMarkAsRead,
}: {
	notification: NotificationResponse;
	onMarkAsRead: (uid: string) => void;
}) => {
	const isUnread = notification.readAt === null;
	const typeLabel = typeLabels[notification.type] || notification.type;

	return (
		<li
			className={`${styles.panel__item} ${isUnread ? styles.panel__itemUnread : ''}`}
		>
			<div className={styles.panel__itemType}>
				<span
					className={`${styles.panel__itemTypeDot} ${styles[`panel__itemTypeDot--${notification.type}`] || ''}`}
				/>
				<span className={styles.panel__itemTypeLabel}>{typeLabel}</span>
				<span className={styles.panel__itemTypeTime}>
					{formatRelativeTime(notification.createdAt)}
				</span>
			</div>
			<div className={styles.panel__itemTitle}>{notification.title}</div>
			<div className={styles.panel__itemMessage}>{notification.message}</div>
			{isUnread && (
				<div className={styles.panel__itemActions}>
					<button
						type="button"
						className={styles.panel__readBtn}
						onClick={() => onMarkAsRead(notification.uid)}
					>
						Marcar como leída
					</button>
				</div>
			)}
		</li>
	);
};

const NotificationBell = () => {
	const { handleData } = useValidate();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const hasPermission = handleData({ per: Permission.notificationRead });
	const markAsRead = useMarkAsRead();
	const { data, isPending, isError, refetch, isRefetching } =
		useNotifications({ enabled: hasPermission });

	const notifications = data?.data ?? [];
	const unreadCount = notifications.filter(n => n.readAt === null).length;

	if (!hasPermission) {
		return null;
	}

	const handleToggle = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);

	const handleMarkAsRead = useCallback(
		(uid: string) => {
			markAsRead.mutate(uid);
		},
		[markAsRead],
	);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	return (
		<div className={styles.bell} ref={containerRef}>
			<Button
				variant="ghost"
				size="sm"
				className={styles.bell__button}
				onClick={handleToggle}
				title="Notificaciones"
				aria-label="Notificaciones"
				aria-expanded={isOpen}
				icon={{ iconName: 'bell' }}
			>
				{unreadCount > 0 && (
					<span className={styles.bell__badge}>
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				)}
			</Button>

			{isOpen && (
				<div className={styles.panel}>
					<div className={styles.panel__header}>
						<span className={styles.panel__headerTitle}>Notificaciones</span>
						<Button
							variant="ghost"
							size="sm"
							className={styles.panel__reloadBtn}
							onClick={() => refetch()}
							aria-label="Recargar notificaciones"
							loading={isRefetching}
							icon={{ iconName: 'spinner' }}
						/>
						<span className={styles.panel__headerCount}>
							{unreadCount} sin leer
						</span>
					</div>

					{isPending ? (
						<div className={styles.panel__loading}>
							<Loader />
						</div>
					) : isError ? (
						<div className={styles.panel__error}>
							<span>Error al cargar notificaciones</span>
							<button
								type="button"
								className={styles.panel__retryBtn}
								onClick={() => refetch()}
							>
								Reintentar
							</button>
						</div>
					) : notifications.length === 0 ? (
						<div className={styles.panel__empty}>No hay notificaciones</div>
					) : (
						<ul className={styles.panel__list}>
							{notifications.map(n => (
								<NotificationItem
									key={n.uid}
									notification={n}
									onMarkAsRead={handleMarkAsRead}
								/>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default NotificationBell;
