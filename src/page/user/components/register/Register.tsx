import { useGet } from '@/api/hooks/useGet';
import { usePost } from '@/api/hooks/usePost';
import { routes } from '@/api/url';
import Form from '@/components/form/Form';
import type { ApiErrorResponse, ApiResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { Role, RolesApiResponse } from '../../../rol/types';
import {
	UserRegisterDTOSchema,
	type UserRegisterDTOTypes,
	type UserUpdateFormTypes,
} from '../../dto/UserDTO';
import styles from '../styles/styles.module.scss';

const Register = () => {
	const navigate = useNavigate();
	const { handleSuccess, handleError } = useApiResponse();

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError: setFormError,
	} = useForm<UserUpdateFormTypes>({
		resolver: zodResolver(UserRegisterDTOSchema) as never,
	});

	const { mutate: handlePost } = usePost<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		UserRegisterDTOTypes
	>(routes.user.create);

	const { data } = useGet<RolesApiResponse>(routes.rol.base, {
		enabled: true,
	});

	const roleOptions =
		data?.data?.rows.map((rol: Role) => ({
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
		handlePost(payload, {
			onSuccess: res => {
				handleSuccess(res);
				navigate('/users');
			},
			onError: err => {
				handleError(err, (field, message) => {
					setFormError(field as keyof UserUpdateFormTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	const renderOptions = [
		{
			type: 'input' as const,
			name: 'names',
			placeholder: 'Nombres',
			label: 'Nombres',
		},
		{
			type: 'input' as const,
			name: 'surnames',
			placeholder: 'Apellidos',
			label: 'Apellidos',
		},
		{
			type: 'input' as const,
			name: 'phone',
			placeholder: 'Teléfono',
			label: 'Teléfono',
		},
		{
			type: 'input' as const,
			name: 'email',
			placeholder: 'Correo',
			label: 'Correo',
			inputType: 'email' as const,
		},
		{
			type: 'input' as const,
			name: 'password',
			placeholder: 'Contraseña',
			label: 'Contraseña',
			inputType: 'password' as const,
		},
		{
			type: 'input' as const,
			name: 'confirmPassword',
			placeholder: 'Confirmar contraseña',
			label: 'Confirmar contraseña',
			inputType: 'password' as const,
		},
		{
			type: 'select' as const,
			name: 'uidRol',
			placeholder: 'Seleccionar rol',
			label: 'Rol',
			options: roleOptions,
		},
	];

	return (
		<section className={styles.form}>
			<Form
				title="Registrar Usuario"
				onSubmit={handleSubmit(onSubmit) as never}
				register={register}
				errors={errors}
				control={control}
				renderOptions={renderOptions}
			/>
		</section>
	);
};

export default Register;
