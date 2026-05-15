import { useLogin } from '@/api/hooks/useLogin';
import useRenderInputs from '@/hooks/useRenderInputs/useRenderInputs';
import LForm from '@/layout/form/LForm';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoginDTOSchema, type LoginDTOTypes } from './dto/LoginDTO';
import styles from './styles.module.scss';

const Login = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<LoginDTOTypes>({ resolver: zodResolver(LoginDTOSchema) });

	const { handleLogin } = useLogin();
	const { renderInput } = useRenderInputs({
		register,
		errors,
	});

	const { token, isInitialized } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (isInitialized && token) {
			navigate('/');
		}
	}, [isInitialized, token]);

	return (
		<section className={styles.login}>
			<LForm
				title="Inicia sección"
				theme
				size="sm"
				onSubmit={handleSubmit(handleLogin)}
			>
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
			</LForm>
		</section>
	);
};
export default Login;
