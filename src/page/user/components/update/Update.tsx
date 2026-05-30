import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import CrudForm from '@/components/crud/CrudForm';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { useToast } from '@/hooks/useToast';
import type { ApiResponse, Role, RolesApiResponse } from '@/globalTypes';
import {
	UserUpdateFormSchema,
	type UserDTOTypes,
	type UserUpdateDTOTypes,
	type UserUpdateFormTypes,
} from '../../dto/UserDTO';
import { accountStatusOptions, statusUserOptions } from '../../options';

const Update = () => {
	const { uid } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!uid) {
			navigate('/users');
		}
	}, [uid, navigate]);

	const { error: toastError } = useToast();
	const { data, isLoading } = useGet<ApiResponse<UserDTOTypes>>(
		routes.user.one.replace(':uid', uid || ''),
		{
			onError: toastError,
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
			setValue('activatedAccount', data.data.activatedAccount ? 'true' : 'false');
		}
	}, [data, setValue]);

	const { data: rolesData } = useGet<RolesApiResponse>(routes.rol.base, {
		onError: toastError,
		enabled: true,
	});

	const roleOptions =
		rolesData?.data?.rows.map((rol: Role) => ({
			value: rol.uid,
			label: rol.name,
		})) || [];

	const { submit } = useFormSubmit<UserUpdateDTOTypes>({
		url: routes.user.base,
		method: 'patch',
		queryKey: ['users'],
		navigateTo: '/users',
	});

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
		submit(payload, {
			onError: (field, message) => {
				setFormError(field as keyof UserUpdateFormTypes, {
					type: 'server',
					message,
				});
			},
		});
	};

	if (!uid || isLoading) {
		return null;
	}

	const renderOptions = [
		{ type: 'input' as const, name: 'names', placeholder: 'Nombres', label: 'Nombres' },
		{ type: 'input' as const, name: 'surnames', placeholder: 'Apellidos', label: 'Apellidos' },
		{ type: 'input' as const, name: 'phone', placeholder: 'Teléfono', label: 'Teléfono' },
		{ type: 'input' as const, name: 'email', placeholder: 'Correo', label: 'Correo', inputType: 'email' as const },
		{ type: 'select' as const, name: 'uidRol', placeholder: 'Seleccionar rol', label: 'Rol', options: roleOptions },
		{ type: 'select' as const, name: 'status', placeholder: 'Seleccionar estado', label: 'Estado', options: statusUserOptions },
		{ type: 'select' as const, name: 'activatedAccount', placeholder: 'Cuenta activada', label: 'Cuenta activada', options: accountStatusOptions },
	];

	return (
		<CrudForm
			title="Actualizar Usuario"
			onSubmit={handleSubmit(onSubmit) as never}
			register={register}
			errors={errors}
			control={control}
			renderOptions={renderOptions}
		/>
	);
};

export default Update;
