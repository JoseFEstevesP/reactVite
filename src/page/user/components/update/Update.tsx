import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGet } from '@/api/hooks/useGet';
import { usePut } from '@/api/hooks/usePut';
import { routes } from '@/api/url';
import Form from '@/components/form/Form';
import type { ApiErrorResponse, ApiResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import {
	UserUpdateFormSchema,
	type UserDTOTypes,
	type UserUpdateDTOTypes,
	type UserUpdateFormTypes,
} from '../../dto/UserDTO';
import type { Role, RolesApiResponse } from '../../../rol/types';
import { accountStatusOptions, statusUserOptions } from '../../options';
import styles from '../styles/styles.module.scss';

const Update = () => {
	const { uid } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!uid) {
			navigate('/users');
		}
	}, [uid, navigate]);

	const { data, isLoading } = useGet<ApiResponse<UserDTOTypes>>(
		routes.user.one.replace(':uid', uid || ''),
		{
			enabled: !!uid,
			staleTime: 0,
			gcTime: 0,
			refetchOnMount: true,
		},
	);

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError: setFormError,
		setValue,
	} = useForm<UserUpdateFormTypes>({
		resolver: zodResolver(UserUpdateFormSchema) as never,
	});

	useEffect(() => {
		if (data?.data) {
			setValue('uid', data.data.uid);
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
	}, [data, setValue]);

	const { data: rolesData } = useGet<RolesApiResponse>(routes.rol.base, {
		enabled: true,
	});

	const roleOptions =
		rolesData?.data?.rows.map((rol: Role) => ({
			value: rol.uid,
			label: rol.name,
		})) || [];

	const { handleSuccess, handleError } = useApiResponse();
	const { mutate: handlePut } = usePut<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		UserUpdateDTOTypes
	>(routes.user.base, { queryKey: ['users'] });

	const onSubmit = (formData: UserUpdateFormTypes) => {
		const payload: UserUpdateDTOTypes = {
			uid: formData.uid,
			names: formData.names,
			surnames: formData.surnames,
			phone: formData.phone,
			email: formData.email,
			uidRol: formData.uidRol,
			status: formData.status === 'true',
			activatedAccount: formData.activatedAccount === 'true',
		};
		handlePut(payload, {
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

	if (!uid || isLoading) {
		return null;
	}

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
			type: 'select' as const,
			name: 'uidRol',
			placeholder: 'Seleccionar rol',
			label: 'Rol',
			options: roleOptions,
		},
		{
			type: 'select' as const,
			name: 'status',
			placeholder: 'Seleccionar estado',
			label: 'Estado',
			options: statusUserOptions,
		},
		{
			type: 'select' as const,
			name: 'activatedAccount',
			placeholder: 'Cuenta activada',
			label: 'Cuenta activada',
			options: accountStatusOptions,
		},
	];

	return (
		<section className={styles.form}>
			<Form
				title="Actualizar Usuario"
				onSubmit={handleSubmit(onSubmit) as never}
				register={register}
				errors={errors}
				control={control}
				renderOptions={renderOptions}
			/>
		</section>
	);
};

export default Update;
