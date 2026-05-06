import type { ReactNode, SVGProps } from 'react';

export type NameIcon =
	| 'add'
	| 'arrow'
	| 'audit'
	| 'checkBoxOff'
	| 'subscription'
	| 'checkBoxOn'
	| 'close'
	| 'company'
	| 'delete'
	| 'edit'
	| 'email'
	| 'exit'
	| 'eye'
	| 'eye_off'
	| 'filter'
	| 'filterOff'
	| 'home'
	| 'link'
	| 'moon'
	| 'padlock'
	| 'payments'
	| 'paymentMethod'
	| 'password'
	| 'profile'
	| 'rol'
	| 'search'
	| 'shield'
	| 'spinner'
	| 'sun'
	| 'date'
	| 'user';

export interface IconParameter extends SVGProps<SVGSVGElement> {
	iconName: NameIcon;
	size?: string | number;
	fallback?: ReactNode;
}
