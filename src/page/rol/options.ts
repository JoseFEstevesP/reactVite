import { Permission, textPermission } from '@/enums/permissions';

export const permissionOptions = Object.values(Permission).map(perm => ({
	value: perm,
	label: textPermission[perm] || perm,
}));
