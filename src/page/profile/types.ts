import type { ValueAll } from '@/globalTypes';

export interface ProfileData {
	names: string;
	surnames: string;
	phone: string;
	email: string;
	rol: {
		name: string;
		permissions: string[];
	};
}

export interface ProfileApiResponse {
	success: boolean;
	data: ProfileData;
	message?: string;
}

export interface AllUsersApiResponse {
	success: boolean;
	data: ValueAll[];
}
