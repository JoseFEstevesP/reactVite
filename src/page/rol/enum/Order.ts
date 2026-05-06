const OrderRolProperty = {
	name: 'name',
	description: 'description',
	status: 'status',
} as const;

type OrderRolProperty =
	(typeof OrderRolProperty)[keyof typeof OrderRolProperty];

export const textOrderRol = {
	[OrderRolProperty.name]: 'Nombre',
	[OrderRolProperty.description]: 'Descripción',
	[OrderRolProperty.status]: 'Estado',
};

export { OrderRolProperty };
