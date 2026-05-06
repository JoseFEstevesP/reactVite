export interface UsersByStatus {
	active: number;
	inactive: number;
}

export interface UsersByRole {
	rolName: string;
	count: number | string;
}

export interface UsersByActivation {
	activated: number;
	pending: number;
}

export interface UsersCreatedOverTime {
	date: string;
	count: number | string;
}

export interface UserChartDataResponse {
	usersByStatus: UsersByStatus;
	usersByRole: UsersByRole[];
	usersByActivation: UsersByActivation;
	usersCreatedOverTime: UsersCreatedOverTime[];
}

export interface UserChartDataApi {
	success: boolean;
	data: UserChartDataResponse;
}

export interface ChartDataItem {
	name: string;
	value: number;
}
