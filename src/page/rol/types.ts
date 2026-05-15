import type { RolUpdateFormTypes } from './dto/RolDTO';

export interface Role {
	uid: string;
	name: string;
	description: string;
	permissions: string[];
	status: boolean;
}

export interface RolesResponse {
	rows: Role[];
	count: number;
	currentPage: number;
	nextPage: number | null;
	previousPage: number | null;
	limit: number;
	pages: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export type RolesApiResponse = ApiResponse<RolesResponse>;

export type FormMode = 'register' | 'update';

export interface Props {
	mode: FormMode;
	initialData?: RolUpdateFormTypes;
	onSubmit: (data: RolUpdateFormTypes) => void;
}
