import { useGet } from '@/api/hooks/useGet';
import { usePut } from '@/api/hooks/usePut';
import { routes } from '@/api/url';
import type { ApiErrorResponse, ApiResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { useToast } from '@/hooks/useToast';
import useValidate from '@/hooks/useValidate';
import { Permission } from '@/page/rol/enum/Permissions';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	ProfileDataUpdateSchema,
	ProfileEmailUpdateSchema,
	ProfilePasswordUpdateSchema,
	type ProfileDataUpdateTypes,
	type ProfileEmailUpdateTypes,
	type ProfilePasswordUpdateTypes,
} from './dto/ProfileDTO';
import styles from './styles.module.scss';
import type { ProfileApiResponse } from './types';

const ProfilePage = () => {
	const { handleData } = useValidate();
	const { success } = useToast();
	const { handleError } = useApiResponse();

	const [showEmailForm, setShowEmailForm] = useState(false);

	const { data, isLoading, refetch } = useGet<ProfileApiResponse>(
		routes.user.profile,
		{ enabled: handleData({ per: Permission.userProfile }) },
	);

	const profile = data?.data;

	const {
		register: registerData,
		handleSubmit: handleSubmitData,
		formState: { errors: errorsData, isSubmitting: isSubmittingData },
		setError: setErrorData,
	} = useForm<ProfileDataUpdateTypes>({
		resolver: zodResolver(ProfileDataUpdateSchema) as never,
	});

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: errorsEmail, isSubmitting: isSubmittingEmail },
		setError: setErrorEmail,
		reset: resetEmail,
	} = useForm<ProfileEmailUpdateTypes>({
		resolver: zodResolver(ProfileEmailUpdateSchema) as never,
	});

	const {
		register: registerPassword,
		handleSubmit: handleSubmitPassword,
		formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
		setError: setErrorPassword,
		reset: resetPassword,
	} = useForm<ProfilePasswordUpdateTypes>({
		resolver: zodResolver(ProfilePasswordUpdateSchema) as never,
	});

	const { mutate: updateData } = usePut<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		ProfileDataUpdateTypes
	>(routes.user.profileData, { queryKey: ['profile'] });

	const { mutate: updateEmail } = usePut<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		ProfileEmailUpdateTypes
	>(routes.user.profileEmail, { queryKey: ['profile'] });

	const { mutate: updatePassword } = usePut<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>,
		ProfilePasswordUpdateTypes
	>(routes.user.profilePassword, { queryKey: ['profile'] });

	const onDataSubmit = (formData: ProfileDataUpdateTypes) => {
		updateData(formData, {
			onSuccess: res => {
				success(res.data?.msg ?? 'Datos actualizados correctamente');
				refetch();
			},
			onError: err => {
				handleError(err, (field, message) => {
					setErrorData(field as keyof ProfileDataUpdateTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	const onEmailSubmit = (formData: ProfileEmailUpdateTypes) => {
		updateEmail(formData, {
			onSuccess: res => {
				success(res.data?.msg ?? 'Correo actualizado correctamente');
				setShowEmailForm(false);
				resetEmail();
				refetch();
			},
			onError: err => {
				handleError(err, (field, message) => {
					setErrorEmail(field as keyof ProfileEmailUpdateTypes, {
						type: 'server',
						message,
					});
				});
			},
		});
	};

	const onPasswordSubmit = (formData: ProfilePasswordUpdateTypes) => {
		updatePassword(
			{
				olPassword: formData.olPassword,
				newPassword: formData.newPassword,
				confirmNewPassword: formData.confirmNewPassword,
			},
			{
				onSuccess: res => {
					success(res.data?.msg ?? 'Contraseña actualizada correctamente');
					resetPassword();
				},
				onError: err => {
					handleError(err, (field, message) => {
						setErrorPassword(
							field as keyof ProfilePasswordUpdateTypes,
							{
								type: 'server',
								message,
							},
						);
					});
				},
			},
		);
	};

	const initials = profile
		? `${profile.names.charAt(0)}${profile.surnames.charAt(0)}`.toUpperCase()
		: '??';

	if (isLoading) {
		return null;
	}

	return (
		<section className={styles.profilePage}>
			{handleData({ per: Permission.userProfile }) && profile && <>
				<div className={styles.profilePage__header}>
						<div className={styles.profilePage__avatar}>
							<span className={styles.profilePage__initials}>
								{initials}
							</span>
						</div>
						<div className={styles.profilePage__headerInfo}>
							<h1 className={styles.profilePage__name}>
								{profile.names} {profile.surnames}
							</h1>
							<p className={styles.profilePage__email}>
								{profile.email}
							</p>
							{profile.rol?.name && (
								<span className={styles.profilePage__roleBadge}>
									{profile.rol.name}
								</span>
							)}
						</div>
					</div>

					<div className={styles.profilePage__section}>
						<h2 className={styles.profilePage__sectionTitle}>
							Datos Personales
						</h2>
						<form
							className={styles.profilePage__form}
							onSubmit={handleSubmitData(onDataSubmit) as never}
						>
							<div className={styles.profilePage__field}>
								<label className={styles.profilePage__label}>
									Nombres
								</label>
									<input
									className={`${styles.profilePage__input} ${errorsData.names ? styles['profilePage__input--error'] : ''}`}
									defaultValue={profile.names}
									placeholder="Ej: Juan"
									{...registerData('names')}
								/>
								{errorsData.names && (
									<span className={styles.profilePage__error}>
										{errorsData.names.message}
									</span>
								)}
							</div>
							<div className={styles.profilePage__field}>
								<label className={styles.profilePage__label}>
									Apellidos
								</label>
									<input
									className={`${styles.profilePage__input} ${errorsData.surnames ? styles['profilePage__input--error'] : ''}`}
									defaultValue={profile.surnames}
									placeholder="Ej: Pérez"
									{...registerData('surnames')}
								/>
								{errorsData.surnames && (
									<span className={styles.profilePage__error}>
										{errorsData.surnames.message}
									</span>
								)}
							</div>
							<div className={styles.profilePage__field}>
								<label className={styles.profilePage__label}>
									Teléfono
								</label>
									<input
									className={`${styles.profilePage__input} ${errorsData.phone ? styles['profilePage__input--error'] : ''}`}
									defaultValue={profile.phone}
									placeholder="Ej: 04121234567"
									{...registerData('phone')}
								/>
								{errorsData.phone && (
									<span className={styles.profilePage__error}>
										{errorsData.phone.message}
									</span>
								)}
							</div>
							<div className={styles.profilePage__actions}>
								<button
									type="submit"
									className={styles.profilePage__btn}
									disabled={isSubmittingData}
								>
									Guardar Cambios
								</button>
							</div>
						</form>
					</div>

					<div className={styles.profilePage__section}>
						<h2 className={styles.profilePage__sectionTitle}>
							Correo Electrónico
						</h2>
						{!showEmailForm ? (
							<>
								<div className={styles.profilePage__info}>
									<span
										className={styles.profilePage__infoLabel}
									>
										Correo actual
									</span>
									<span
										className={styles.profilePage__infoValue}
									>
										{profile.email}
									</span>
								</div>
								<div className={styles.profilePage__actions}>
									<button
										type="button"
										className={styles.profilePage__btn}
										onClick={() => setShowEmailForm(true)}
									>
										Cambiar Correo
									</button>
								</div>
							</>
						) : (
							<form
								className={styles.profilePage__form}
								onSubmit={handleSubmitEmail(onEmailSubmit) as never}
							>
								<div className={styles.profilePage__field}>
									<label
										className={styles.profilePage__label}
									>
										Nuevo Correo
									</label>
									<input
										className={`${styles.profilePage__input} ${errorsEmail.email ? styles['profilePage__input--error'] : ''}`}
										placeholder="nuevo@correo.com"
										{...registerEmail('email')}
									/>
									{errorsEmail.email && (
										<span
											className={styles.profilePage__error}
										>
											{errorsEmail.email.message}
										</span>
									)}
								</div>
								<div className={styles.profilePage__field}>
									<label
										className={styles.profilePage__label}
									>
										Contraseña Actual
									</label>
									<input
										type="password"
										className={`${styles.profilePage__input} ${errorsEmail.password ? styles['profilePage__input--error'] : ''}`}
										placeholder="Contraseña actual"
										{...registerEmail('password')}
									/>
									{errorsEmail.password && (
										<span
											className={styles.profilePage__error}
										>
											{errorsEmail.password.message}
										</span>
									)}
								</div>
								<div className={styles.profilePage__actions}>
									<button
										type="submit"
										className={styles.profilePage__btn}
										disabled={isSubmittingEmail}
									>
										Actualizar Correo
									</button>
									<button
										type="button"
										className={`${styles.profilePage__btn} ${styles['profilePage__btn--secondary']}`}
										onClick={() => {
											setShowEmailForm(false);
											resetEmail();
										}}
									>
										Cancelar
									</button>
								</div>
							</form>
						)}
					</div>

					<div className={styles.profilePage__section}>
						<h2 className={styles.profilePage__sectionTitle}>
							Cambiar Contraseña
						</h2>
						<form
							className={styles.profilePage__form}
							onSubmit={handleSubmitPassword(
								onPasswordSubmit,
							) as never}
						>
							<div className={styles.profilePage__field}>
								<label className={styles.profilePage__label}>
									Contraseña Actual
								</label>
									<input
									type="password"
									className={`${styles.profilePage__input} ${errorsPassword.olPassword ? styles['profilePage__input--error'] : ''}`}
									placeholder="Contraseña actual"
									{...registerPassword('olPassword')}
								/>
								{errorsPassword.olPassword && (
									<span className={styles.profilePage__error}>
										{errorsPassword.olPassword.message}
									</span>
								)}
							</div>
							<div className={styles.profilePage__field}>
								<label className={styles.profilePage__label}>
									Nueva Contraseña
								</label>
									<input
									type="password"
									className={`${styles.profilePage__input} ${errorsPassword.newPassword ? styles['profilePage__input--error'] : ''}`}
									placeholder="Nueva contraseña"
									{...registerPassword('newPassword')}
								/>
								{errorsPassword.newPassword && (
									<span className={styles.profilePage__error}>
										{errorsPassword.newPassword.message}
									</span>
								)}
							</div>
							<div className={styles.profilePage__field}>
								<label className={styles.profilePage__label}>
									Confirmar Nueva Contraseña
								</label>
									<input
									type="password"
									className={`${styles.profilePage__input} ${errorsPassword.confirmNewPassword ? styles['profilePage__input--error'] : ''}`}
									placeholder="Confirmar nueva contraseña"
									{...registerPassword('confirmNewPassword')}
								/>
								{errorsPassword.confirmNewPassword && (
									<span className={styles.profilePage__error}>
										{errorsPassword.confirmNewPassword.message}
									</span>
								)}
							</div>
							<div className={styles.profilePage__actions}>
								<button
									type="submit"
									className={styles.profilePage__btn}
									disabled={isSubmittingPassword}
								>
									Actualizar Contraseña
								</button>
							</div>
						</form>
					</div>
				</>
			}
		</section>
	);
};
export default ProfilePage;
