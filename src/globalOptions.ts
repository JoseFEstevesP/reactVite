export const ModuleStatus = {
	all: '',
	active: 'true',
	inactive: 'false',
};

export const textModuleStatus: Record<string, string> = {
	[ModuleStatus.active]: 'Activo',
	[ModuleStatus.inactive]: 'Inactivo',
};

export const statusOptions: { value: string; label: string }[] = [
	{ value: 'true', label: 'Activo' },
	{ value: 'false', label: 'Inactivo' },
];
