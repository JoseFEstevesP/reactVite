import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '@/api/url';
import CrudForm from '@/components/crud/CrudForm';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import {
	RolRegisterDTOSchema,
	type RolRegisterDTOTypes,
	type RolUpdateFormTypes,
} from '../../dto/RolDTO';
import { permissionOptions } from '../../options';

const Register = () => {
	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
		setError: setFormError,
	} = useForm<RolUpdateFormTypes>({
		resolver: zodResolver(RolRegisterDTOSchema) as never,
	});

	const { submit } = useFormSubmit<RolRegisterDTOTypes>({
		url: routes.rol.base,
		method: 'post',
		queryKey: ['roles'],
		navigateTo: '/rol',
	});

	const onSubmit = (data: RolUpdateFormTypes) => {
		if (!data.permissions || data.permissions.length === 0) {
			return;
		}
		const payload: RolRegisterDTOTypes = {
			name: data.name,
			description: data.description,
			permissions: data.permissions,
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
		<CrudForm
			title="Registrar Rol"
			onSubmit={handleSubmit(onSubmit) as never}
			register={register}
			errors={errors}
			control={control}
			renderOptions={renderOptions}
			size="sm"
		/>
	);
};

export default Register;
