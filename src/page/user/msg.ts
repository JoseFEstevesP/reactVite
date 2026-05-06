export const msg = {
	names: {
		required: 'Nombre requerido',
		minLength: 'Nombre demasiado corto',
		maxLength: 'Nombre demasiado largo',
		noNumbers: 'No se permiten números',
		noSymbols: 'No se permiten símbolos',
	},
	surnames: {
		required: 'Apellido requerido',
		minLength: 'Apellido demasiado corto',
		maxLength: 'Apellido demasiado largo',
		noNumbers: 'No se permiten números',
		noSymbols: 'No se permiten símbolos',
	},
	phone: {
		required: 'Teléfono requerido',
		pattern:
			'Formato de teléfono incorrecto. Ejemplos válidos: 04121234567, +584141234567, 2125551234',
	},
	email: {
		invalid: 'Correo inválido',
		required: 'Correo requerido',
	},
	password: {
		required: 'Contraseña requerida',
		minLength: 'Contraseña demasiado corta',
		maxLength: 'Contraseña demasiado larga',
		complexity:
			'La contraseña debe contener mayúsculas, minúsculas, números y símbolos',
	},
	uidRol: {
		invalid: 'Rol inválido',
		required: 'Rol requerido',
	},
	status: {
		required: 'Estado requerido',
	},
	activatedAccount: {
		required: 'Activación de cuenta requerida',
	},
	confirmPassword: {
		required: 'Confirmación de contraseña requerida',
		match: 'Las contraseñas no coinciden',
	},
};
