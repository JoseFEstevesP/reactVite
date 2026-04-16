import type { ReactNode, SVGProps } from 'react';

export type NameIcon =
	| 'add'
	| 'arrow'
	| 'checkBoxOff'
	| 'checkBoxOn'
	| 'close'
	| 'edit'
	| 'email'
	| 'exit'
	| 'eye'
	| 'eye_off'
	| 'filter'
	| 'filterOff'
	| 'link'
	| 'moon'
	| 'padlock'
	| 'password'
	| 'profile'
	| 'role'
	| 'search'
	| 'shield'
	| 'spinner'
	| 'sun'
	| 'user';

export interface IconParameter extends SVGProps<SVGSVGElement> {
	iconName: NameIcon;
	size?: string | number;
	fallback?: ReactNode;
}
