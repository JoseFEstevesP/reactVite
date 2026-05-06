import { usePost } from '@/api/hooks/usePost';
import { routes } from '@/api/url';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import useRenderInputs from '@/hooks/useRenderInputs/useRenderInputs';
import { useApiResponse } from '@/hooks/useApiResponse';
import LForm from '@/layout/form/LForm';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
	UserRegisterDTOSchema,
	type UserRegisterDTOTypes,
} from '../../dto/UserDTO';
import styles from './styles.module.scss';
import { useGet } from '@/api/hooks/useGet';
import type { Role, RolesApiResponse } from '../../../rol/types';

const Register = () => {
	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<UserRegisterDTOTypes>({
		resolver: zodResolver(UserRegisterDTOSchema),
	});
	const { handleSuccess, handleError } = useApiResponse();

	const { data } = useGet<RolesApiResponse>(routes.rol.base, {
		enabled: true,
	});

	const { mutate: handlePost } = usePost<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		UserRegisterDTOTypes
	>(routes.user.create);
	const { renderInput, renderSelect } = useRenderInputs({
		register,
		control,
		errors,
	});

	const navigate = useNavigate();

	const roleOptions =
		data?.data?.rows.map((rol: Role) => ({
			value: rol.uid,
			label: rol.name,
		})) || [];

	const onSubmit = (data: UserRegisterDTOTypes) => {
		handlePost(data, {
			onSuccess: res => {
				handleSuccess(res);
				navigate('/users');
			},
			onError: err => {
				handleError(err, (field, message) => {
					setError(field as keyof UserRegisterDTOTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	return (
		<section className={styles.register}>
			<LForm title="Registrar Usuario" onSubmit={handleSubmit(onSubmit)}>
				{renderInput({
					name: 'names',
					placeholder: 'Nombres',
					label: 'Nombres',
				})}
				{renderInput({
					name: 'surnames',
					placeholder: 'Apellidos',
					label: 'Apellidos',
				})}
				{renderInput({
					name: 'phone',
					placeholder: 'Teléfono',
					label: 'Teléfono',
				})}
				{renderInput({
					name: 'email',
					placeholder: 'Correo',
					label: 'Correo',
					type: 'email',
				})}
				{renderInput({
					name: 'password',
					placeholder: 'Contraseña',
					label: 'Contraseña',
					type: 'password',
				})}
				{renderInput({
					name: 'confirmPassword',
					placeholder: 'Confirmar contraseña',
					label: 'Confirmar contraseña',
					type: 'password',
				})}
				{renderSelect({
					name: 'uidRol',
					placeholder: 'Seleccionar rol',
					label: 'Rol',
					options: roleOptions,
				})}
			</LForm>
		</section>
	);
};
export default Register;
