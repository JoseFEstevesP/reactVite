import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import CrudForm from '@/components/crud/CrudForm';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { useToast } from '@/hooks/useToast';
import { statusOptions } from '@/globalOptions';
import type { ApiResponse } from '@/globalTypes';
import {
	RolUpdateFormSchema,
	type RolDTOTypes,
	type RolUpdateDTOTypes,
	type RolUpdateFormTypes,
} from '../../dto/RolDTO';
import { permissionOptions } from '../../options';

const Update = () => {
	const { uid } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!uid) {
			navigate('/rol');
		}
	}, [uid, navigate]);

	const { error: toastError } = useToast();
	const { data, isLoading } = useGet<ApiResponse<RolDTOTypes>>(
		routes.rol.one.replace(':uid', uid || ''),
		{
			onError: toastError,
			queryKey: ['rol', uid || ''],
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
	} = useForm<RolUpdateFormTypes>({
		resolver: zodResolver(RolUpdateFormSchema),
	});

	useEffect(() => {
		if (data?.data) {
			setValue('uid', data.data.uid);
			setValue('name', data.data.name);
			setValue('description', data.data.description);
			setValue('permissions', data.data.permissions);
			setValue('status', data.data.status ? 'true' : 'false');
		}
	}, [data, setValue]);

	const { submit } = useFormSubmit<RolUpdateDTOTypes>({
		url: routes.rol.base,
		method: 'patch',
		queryKey: ['roles'],
		navigateTo: '/rol',
	});

	const onSubmit = (formData: RolUpdateFormTypes) => {
		const payload: RolUpdateDTOTypes = {
			uid: formData.uid,
			name: formData.name,
			description: formData.description,
			permissions: formData.permissions,
			status: formData.status === 'true',
		};
		submit(payload, {
			onError: (field, message) => {
				setFormError(field as keyof RolUpdateFormTypes, {
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
		{
			type: 'select' as const,
			name: 'status',
			placeholder: 'Seleccionar estado',
			label: 'Estado',
			options: statusOptions,
		},
	];

	return (
		<CrudForm
			title="Actualizar Rol"
			onSubmit={handleSubmit(onSubmit) as never}
			register={register}
			errors={errors}
			control={control}
			renderOptions={renderOptions}
			size="sm"
		/>
	);
};

export default Update;
