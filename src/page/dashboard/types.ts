export interface UsersByStatus {
	active: number;
	inactive: number;
}

export interface UsersByRole {
	rolName: string;
	count: string;
}

export interface DashboardData {
	totalUsers: number;
	usersByStatus: UsersByStatus;
	usersByRole: UsersByRole[];
	activeSessions: number;
	activeUsers: number;
}
