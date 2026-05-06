export interface AuditUser {
	names: string;
	surnames: string;
}

export interface Audit {
	uid: string;
	uidUser: string;
	dataToken: string[];
	createdAt: string;
	user: AuditUser;
}

export interface AuditsResponse {
	rows: Audit[];
	count: number;
	currentPage: number;
	nextPage: number | null;
	previousPage: number | null;
	limit: number;
	pages: number;
}

export interface AuditsApiResponse {
	success: boolean;
	data: AuditsResponse;
	message?: string;
}
