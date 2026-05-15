import { Permission, textPermission } from './enum/Permissions';

export const permissionOptions = Object.values(Permission).map(perm => ({
	value: perm,
	label: textPermission[perm] || perm,
}));
