export interface NotificationResponse {
	uid: string;
	type: NotificationType;
	title: string;
	message: string;
	referenceUid?: string;
	referenceModule?: string;
	readAt: string | null;
	createdAt: string;
}

export type NotificationType =
	| 'payment_failed'
	| 'payment_success'
	| 'payment_overdue'
	| 'server_disconnected'
	| 'server_connected'
	| 'system_alert';
