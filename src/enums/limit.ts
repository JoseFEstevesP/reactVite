const LimitFetchData = {
	'd-10': '10',
	'd-20': '20',
	'd-30': '30',
} as const;

type LimitFetchData = (typeof LimitFetchData)[keyof typeof LimitFetchData];

export { LimitFetchData };
