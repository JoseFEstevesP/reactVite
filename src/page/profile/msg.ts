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
			'Formato de teléfono incorrecto',
	},
	email: {
		invalid: 'Correo inválido',
		required: 'Correo requerido',
	},
	password: {
		required: 'Contraseña requerida',
		minLength: 'Contraseña demasiado corta',
		complexity:
			'Debe contener mayúsculas, minúsculas, números y símbolos',
	},
	confirmPassword: {
		required: 'Confirmación requerida',
		match: 'Las contraseñas no coinciden',
	},
};
