const OrderEnum = {
	ASC: 'ASC',
	DESC: 'DESC',
} as const;

type OrderEnum = (typeof OrderEnum)[keyof typeof OrderEnum];

export { OrderEnum };
