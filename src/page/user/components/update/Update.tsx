import { useGet } from '@/api/hooks/useGet';
import { usePut } from '@/api/hooks/usePut';
import { routes } from '@/api/url';
import type { ApiErrorResponse, ApiResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import useRenderInputs from '@/hooks/useRenderInputs/useRenderInputs';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import LForm from '../../../../layout/form/LForm';
import {
	UserUpdateFormSchema,
	type UserDTOTypes,
	type UserUpdateDTOTypes,
	type UserUpdateFormTypes,
} from '../../dto/UserDTO';
import type { Role, RolesApiResponse } from '../../../rol/types';
import styles from './../register/styles.module.scss';

const Update = () => {
	const { uid } = useParams();
	const navigate = useNavigate();
	const { error: toastError } = useToast();

	useEffect(() => {
		if (!uid) {
			toastError('No se pudo encontrar el usuario');
			navigate('/users');
		}
	}, [uid]);

	const { data } = useGet<ApiResponse<UserDTOTypes>>(
		routes.user.one.replace(':uid', uid || ''),
		{
			enabled: !!uid,
		},
	);

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError,
		setValue,
	} = useForm<UserUpdateFormTypes>({
		resolver: zodResolver(UserUpdateFormSchema),
	});

	useEffect(() => {
		if (data && uid) {
			setValue('uid', uid);
			setValue('names', data.data.names);
			setValue('surnames', data.data.surnames);
			setValue('phone', data.data.phone);
			setValue('email', data.data.email);
			setValue('uidRol', data.data.uidRol);
			setValue('status', data.data.status ? 'true' : 'false');
			setValue(
				'activatedAccount',
				data.data.activatedAccount ? 'true' : 'false',
			);
		}
	}, [data, uid, setValue]);

	const { handleSuccess, handleError } = useApiResponse();
	const { mutate: handlePut } = usePut<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		UserUpdateDTOTypes
	>(routes.user.base);
	const { renderInput, renderSelect } = useRenderInputs({
		register,
		control,
		errors,
	});

	const { data: rolesData } = useGet<RolesApiResponse>(routes.rol.base, {
		enabled: true,
	});

	const roleOptions =
		rolesData?.data?.rows.map((rol: Role) => ({
			value: rol.uid,
			label: rol.name,
		})) || [];

	const statusOptions: { value: string; label: string }[] = [
		{ value: 'true', label: 'Activo' },
		{ value: 'false', label: 'Inactivo' },
	];

	const activatedAccountOptions: { value: string; label: string }[] = [
		{ value: 'true', label: 'Sí' },
		{ value: 'false', label: 'No' },
	];

	const onSubmit = (data: UserUpdateFormTypes) => {
		const payload = {
			...data,
			status: data.status === 'true',
			activatedAccount: data.activatedAccount === 'true',
		};
		handlePut(payload as unknown as UserUpdateDTOTypes, {
			onSuccess: res => {
				handleSuccess(res);
				navigate('/users');
			},
			onError: err => {
				handleError(err, (field, message) => {
					setError(field as keyof UserUpdateFormTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	return (
		<section className={styles.register}>
			<LForm title="Actualizar Usuario" onSubmit={handleSubmit(onSubmit)}>
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
				{renderSelect({
					name: 'uidRol',
					placeholder: 'Seleccionar rol',
					label: 'Rol',
					options: roleOptions,
				})}
				{renderSelect({
					name: 'status',
					placeholder: 'Seleccionar estado',
					label: 'Estado',
					options: statusOptions,
				})}
				{renderSelect({
					name: 'activatedAccount',
					placeholder: 'Cuenta activada',
					label: 'Cuenta activada',
					options: activatedAccountOptions,
				})}
			</LForm>
		</section>
	);
};
export default Update;
