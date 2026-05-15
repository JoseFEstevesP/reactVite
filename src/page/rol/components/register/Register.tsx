import { usePost } from '@/api/hooks/usePost';
import { routes } from '@/api/url';
import Form from '@/components/form/Form';
import type { ApiErrorResponse, ApiResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
	RolRegisterDTOSchema,
	type RolRegisterDTOTypes,
	type RolUpdateFormTypes,
} from '../../dto/RolDTO';
import { permissionOptions } from '../../options';
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
	} = useForm<RolUpdateFormTypes>({
		resolver: zodResolver(RolRegisterDTOSchema) as never,
	});

	const { mutate: handlePost } = usePost<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		RolRegisterDTOTypes
	>(routes.rol.base, { queryKey: ['roles'] });

	const onSubmit = (data: RolUpdateFormTypes) => {
		if (!data.permissions || data.permissions.length === 0) {
			return;
		}
		const payload: RolRegisterDTOTypes = {
			name: data.name,
			description: data.description,
			permissions: data.permissions,
		};
		handlePost(payload, {
			onSuccess: res => {
				handleSuccess(res);
				navigate('/rol');
			},
			onError: err => {
				handleError(err, (field, message) => {
					setFormError(field as keyof RolUpdateFormTypes, {
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
			name: 'name',
			placeholder: 'Nombre del rol',
			label: 'Nombre',
		},
		{
			type: 'input' as const,
			name: 'description',
			placeholder: 'Descripción del rol',
			label: 'Descripción',
		},
		{
			type: 'selectMultiple' as const,
			name: 'permissions',
			placeholder: 'Seleccionar permisos',
			label: 'Permisos',
			options: permissionOptions,
		},
	];

	return (
		<section className={styles.form}>
			<Form
				title="Registrar Rol"
				onSubmit={handleSubmit(onSubmit) as never}
				register={register}
				errors={errors}
				control={control}
				renderOptions={renderOptions}
				size="sm"
			/>
		</section>
	);
};

export default Register;
