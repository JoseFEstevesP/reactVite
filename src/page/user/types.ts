export interface User {
	uid: string;
	names: string;
	surnames: string;
	phone: string;
	email: string;
	uidRol: string;
	rol: Rol;
	status: boolean;
	activatedAccount: boolean;
}

export interface Rol {
	name: string;
	permissions: string[];
}

export interface UsersResponse {
	rows: User[];
	count: number;
	currentPage: number;
	nextPage: number | null;
	previousPage: number | null;
	limit: number;
	pages: number;
}

export interface UsersApiResponse {
	success: boolean;
	data: UsersResponse;
	message?: string;
}
