import { decrypt } from '@/functions/decrypt';
import { useRolStore } from '@/stores/rolStore';
import { useCallback, useEffect, useState } from 'react';

const ENCRYPTION_KEY =
	import.meta.env.VITE_ENCRYPTION_KEY ?? import.meta.env.ENCRYPTION_KEY ?? '';

interface RolData {
	name: string;
	permissions: string[];
}

const useValidate = () => {
	const { encryptedRol } = useRolStore();
	const [rolData, setRolData] = useState<RolData | null>(null);

	useEffect(() => {
		if (!encryptedRol) {
			setRolData(null);
			return;
		}

		decrypt(encryptedRol, ENCRYPTION_KEY)
			.then(data => {
				setRolData(JSON.parse(data) as RolData);
			})
			.catch(() => {
				setRolData(null);
			});
	}, [encryptedRol]);

	const handleData = useCallback(
		({ per }: { per: string }) => {
			if (!rolData) return false;
			return rolData.permissions.some(
				item => item === per || item === 'SUPER',
			);
		},
		[rolData],
	);

	return { handleData };
};

export default useValidate;
