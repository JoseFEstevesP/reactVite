import type { ReactNode } from 'react';
import useValidate from '@/hooks/useValidate';

interface RestrictedProps {
	per: string;
	children: ReactNode;
}

const Restricted = ({ per, children }: RestrictedProps) => {
	const { handleData } = useValidate();

	if (handleData({ per })) {
		return <>{children}</>;
	}

	return null;
};

export default Restricted;
