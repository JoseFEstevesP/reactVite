import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import CrudForm from '@/components/crud/CrudForm';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { useToast } from '@/hooks/useToast';
import type { Role, RolesApiResponse } from '@/globalTypes';
import {
	UserRegisterDTOSchema,
	type UserRegisterDTOTypes,
	type UserUpdateFormTypes,
} from '../../dto/UserDTO';

const Register = () => {
	const { error: toastError } = useToast();

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError: setFormError,
	} = useForm<UserUpdateFormTypes>({
		resolver: zodResolver(UserRegisterDTOSchema) as never,
	});

	const { submit } = useFormSubmit<UserRegisterDTOTypes>({
		url: routes.user.create,
		method: 'post',
		navigateTo: '/users',
	});

	const { data: rolesData } = useGet<RolesApiResponse>(routes.rol.base, {
		onError: toastError,
		enabled: true,
	});

	const roleOptions =
		rolesData?.data?.rows.map((rol: Role) => ({
			value: rol.uid,
			label: rol.name,
		})) || [];

	const onSubmit = (data: UserUpdateFormTypes) => {
		const payload: UserRegisterDTOTypes = {
			names: data.names,
			surnames: data.surnames,
			phone: data.phone,
			email: data.email,
			password: (data as Record<string, unknown>).password as string,
			confirmPassword: (data as Record<string, unknown>)
				.confirmPassword as string,
			uidRol: data.uidRol,
		};
		submit(payload, {
			onError: (field, message) => {
				setFormError(field as keyof UserUpdateFormTypes, {
					type: 'server',
					message,
				});
			},
		});
	};

	const renderOptions = [
		{ type: 'input' as const, name: 'names', placeholder: 'Nombres', label: 'Nombres' },
		{ type: 'input' as const, name: 'surnames', placeholder: 'Apellidos', label: 'Apellidos' },
		{ type: 'input' as const, name: 'phone', placeholder: 'Teléfono', label: 'Teléfono' },
		{ type: 'input' as const, name: 'email', placeholder: 'Correo', label: 'Correo', inputType: 'email' as const },
		{ type: 'input' as const, name: 'password', placeholder: 'Contraseña', label: 'Contraseña', inputType: 'password' as const },
		{ type: 'input' as const, name: 'confirmPassword', placeholder: 'Confirmar contraseña', label: 'Confirmar contraseña', inputType: 'password' as const },
		{ type: 'select' as const, name: 'uidRol', placeholder: 'Seleccionar rol', label: 'Rol', options: roleOptions },
	];

	return (
		<CrudForm
			title="Registrar Usuario"
			onSubmit={handleSubmit(onSubmit) as never}
			register={register}
			errors={errors}
			control={control}
			renderOptions={renderOptions}
		/>
	);
};

export default Register;
