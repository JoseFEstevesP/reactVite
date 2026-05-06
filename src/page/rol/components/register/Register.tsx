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
	RolRegisterDTOSchema,
	type RolRegisterDTOTypes,
} from '../../dto/RolDTO';
import { Permission, textPermission } from '../../enum/Permissions';
import styles from './styles.module.scss';

const Register = () => {
	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<RolRegisterDTOTypes>({
		resolver: zodResolver(RolRegisterDTOSchema),
	});
	const { handleSuccess, handleError } = useApiResponse();

	const { mutate: handlePost } = usePost<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		RolRegisterDTOTypes
	>(routes.rol.base);
	const { renderInput, renderSelectMultiple } = useRenderInputs({
		register,
		control,
		errors,
	});

	const navigate = useNavigate();

	const permissionOptions = Object.values(Permission).map(perm => ({
		value: perm,
		label: textPermission[perm] || perm,
	}));

	const onSubmit = (data: RolRegisterDTOTypes) => {
		handlePost(data, {
			onSuccess: res => {
				handleSuccess(res);
				navigate('/rol');
			},
			onError: err => {
				handleError(err, (field, message) => {
					setError(field as keyof RolRegisterDTOTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	return (
		<section className={styles.register}>
			<LForm title="Registrar Rol" onSubmit={handleSubmit(onSubmit)} size="sm">
				{renderInput({
					name: 'name',
					placeholder: 'Nombre del rol',
					label: 'Nombre',
				})}
				{renderInput({
					name: 'description',
					placeholder: 'Descripción del rol',
					label: 'Descripción',
				})}
				{renderSelectMultiple({
					name: 'permissions',
					placeholder: 'Seleccionar permisos',
					label: 'Permisos',
					options: permissionOptions,
				})}
			</LForm>
		</section>
	);
};
export default Register;
