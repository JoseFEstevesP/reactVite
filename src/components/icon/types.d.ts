import type { ReactNode, SVGProps } from 'react';

export type IconPack = 'default' | 'reactVite';

export type NameIcon =
	| 'add'
	| 'arrow'
	| 'audit'
	| 'bell'
	| 'checkBoxOff'
	| 'subscription'
	| 'system'
	| 'checkBoxOn'
	| 'code'
	| 'close'
	| 'company'
	| 'companyRequest'
	| 'companySyste'
	| 'delete'
	| 'plan'
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
	| 'historyPayment'
	| 'system'
	| 'user';

export interface IconParameter extends SVGProps<SVGSVGElement> {
	iconName: NameIcon;
	pack?: IconPack;
	size?: string | number;
	fallback?: ReactNode;
}
