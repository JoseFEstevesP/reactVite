import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './components/button/Button';
import Checkbox from './components/checkbox/Checkbox';
import useRenderInputs from './hooks/useRenderInputs/useRenderInputs';

const schema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	email: z.string().email('Email inválido'),
	role: z.string().min(1, 'Selecciona un rol'),
	active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const roleOptions = [
	{ value: 'admin', label: 'Administrador' },
	{ value: 'user', label: 'Usuario' },
	{ value: 'editor', label: 'Editor' },
];

function App() {
	const {
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
			role: '',
			active: true,
		},
	});

	const { renderInput, renderSelect } = useRenderInputs<FormData>({ errors });

	const onSubmit = (data: FormData) => {
		console.log('Form data:', data);
		alert('Formulario enviado:\n' + JSON.stringify(data, null, 2));
	};

	return (
		<div
			style={{
				padding: '2rem',
				maxWidth: '500px',
				margin: '0 auto',
			}}
		>
			<h1>Formulario de Ejemplo</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
			>
				{renderInput({
					name: 'name',
					label: 'Nombre',
					placeholder: 'Ingresa tu nombre',
				})}

				{renderInput({
					name: 'email',
					label: 'Email',
					placeholder: 'correo@ejemplo.com',
					type: 'email',
				})}

				{renderSelect({
					name: 'role',
					label: 'Rol',
					placeholder: 'Selecciona un rol',
					options: roleOptions,
				})}

				<Checkbox
					name="active"
					value={true}
					onChange={value => console.log('Checkbox:', value)}
					label="Usuario activo"
				/>

				<div
					style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
				>
					<Button type="reset" variant="secondary">
						Limpiar
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Enviando...' : 'Enviar'}
					</Button>
				</div>
			</form>
		</div>
	);
}

export default App;
