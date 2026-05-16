import { create } from 'zustand';

interface RolState {
	encryptedRol: string | null;
	setEncryptedRol: (rol: string | null) => void;
}

export const useRolStore = create<RolState>(set => ({
	encryptedRol: sessionStorage.getItem('encryptedRol') ?? null,

	setEncryptedRol: encryptedRol => {
		if (encryptedRol) {
			sessionStorage.setItem('encryptedRol', encryptedRol);
		} else {
			sessionStorage.removeItem('encryptedRol');
		}
		set({ encryptedRol });
	},
}));
