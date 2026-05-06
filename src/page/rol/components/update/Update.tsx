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
	RolUpdateFormSchema,
	type RolDTOTypes,
	type RolUpdateDTOTypes,
	type RolUpdateFormTypes,
} from '../../dto/RolDTO';
import { Permission, textPermission } from '../../enum/Permissions';
import styles from './../register/styles.module.scss';

const Update = () => {
	const { uid } = useParams();
	const navigate = useNavigate();
	const { error: toastError } = useToast();

	useEffect(() => {
		if (!uid) {
			toastError('No se pudo encontrar el rol');
			navigate('/rol');
		}
	}, [uid]);

	const { data } = useGet<ApiResponse<RolDTOTypes>>(
		routes.rol.one.replace(':uid', uid || ''),
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
	} = useForm<RolUpdateFormTypes>({
		resolver: zodResolver(RolUpdateFormSchema),
	});

	useEffect(() => {
		if (data && uid) {
			setValue('uid', uid);
			setValue('name', data.data.name);
			setValue('description', data.data.description);
			setValue('permissions', data.data.permissions);
			setValue('status', data.data.status ? 'true' : 'false');
		}
	}, [data, uid, setValue]);

	const { handleSuccess, handleError } = useApiResponse();
	const { mutate: handlePut } = usePut<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		RolUpdateDTOTypes
	>(routes.rol.base);
	const { renderInput, renderSelect, renderSelectMultiple } = useRenderInputs({
		register,
		control,
		errors,
	});

	const onSubmit = (data: RolUpdateFormTypes) => {
		const payload = {
			...data,
			status: data.status === 'true',
		};
		handlePut(payload, {
			onSuccess: res => {
				handleSuccess(res);
				navigate('/rol');
			},
			onError: err => {
				handleError(err, (field, message) => {
					setError(field as keyof RolUpdateFormTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	const permissionOptions = Object.values(Permission).map(perm => ({
		value: perm,
		label: textPermission[perm] || perm,
	}));
	const statusOptions: { value: string; label: string }[] = [
		{ value: 'true', label: 'Activo' },
		{ value: 'false', label: 'Inactivo' },
	];

	return (
		<section className={styles.register}>
			<LForm title="Actualizar Rol" onSubmit={handleSubmit(onSubmit)} size="sm">
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
				{renderSelect({
					name: 'status',
					placeholder: 'Seleccionar estado',
					label: 'Estado',
					options: statusOptions,
				})}
			</LForm>
		</section>
	);
};
export default Update;
