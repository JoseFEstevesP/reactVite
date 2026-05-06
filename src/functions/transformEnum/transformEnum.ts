import type { TransformEnumType } from './types';

export const transformEnum = ({
	transformEnum,
	text,
}: {
	transformEnum: TransformEnumType;
	text?: Record<string, string>;
}) => {
	return Object.keys(transformEnum).map(item => {
		const value = transformEnum[item];
		return {
			value,
			label: text ? text[value] : value,
		};
	});
};
