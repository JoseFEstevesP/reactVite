import type { TransformEnumType } from './types';

export const transformEnum = ({
	transformEnum,
	text,
}: {
	transformEnum: TransformEnumType;
	text?: Record<string, string>;
}) => {
	return Object.keys(transformEnum).map(item => {
		return {
			value: transformEnum[item],
			label: text ? text[item] : transformEnum[item],
		};
	});
};
