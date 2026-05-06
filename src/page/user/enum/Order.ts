const OrderUserProperty = {
	names: 'names',
	surnames: 'surnames',
	phone: 'phone',
	email: 'email',
} as const;

type OrderUserProperty =
	(typeof OrderUserProperty)[keyof typeof OrderUserProperty];

export const textOrderUser = {
	[OrderUserProperty.names]: 'Nombre',
	[OrderUserProperty.surnames]: 'Apellido',
	[OrderUserProperty.email]: 'Correo',
	[OrderUserProperty.phone]: 'Teléfono',
};

export { OrderUserProperty };
