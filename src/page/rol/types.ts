import type { RolUpdateFormTypes } from './dto/RolDTO';

export type FormMode = 'register' | 'update';

export interface Props {
	mode: FormMode;
	initialData?: RolUpdateFormTypes;
	onSubmit: (data: RolUpdateFormTypes) => void;
}
