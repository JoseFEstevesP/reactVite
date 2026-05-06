const OrderAuditProperty = {
	names: 'names',
	surnames: 'surnames',
	ip: 'ip',
	userAgent: 'userAgent',
	userPlatform: 'userPlatform',
} as const;

type OrderAuditProperty =
	(typeof OrderAuditProperty)[keyof typeof OrderAuditProperty];

export const textOrderAudit = {
	[OrderAuditProperty.names]: 'Nombre',
	[OrderAuditProperty.surnames]: 'Apellido',
	[OrderAuditProperty.ip]: 'IP',
	[OrderAuditProperty.userAgent]: 'Navegador',
	[OrderAuditProperty.userPlatform]: 'Plataforma',
};

export { OrderAuditProperty };
