import { Button } from '@/components/button/Button';
import { ButtonTheme } from '@/components/buttonTheme/ButtonTheme';
import styles from './styles.module.scss';

export interface LFormProps {
	children: React.ReactNode;
	theme?: boolean;
	onSubmit?: () => void;
	size?: 'sm' | 'md';
	title: string;
}

const LForm = ({
	children,
	theme = false,
	onSubmit,
	size = 'md',
	title,
}: LFormProps) => {
	return (
		<section className={`${styles.LForm} ${styles[`LForm--${size}`]}`}>
			<div className={styles.LForm__header}>
				<h2>{title}</h2>
				{theme && <ButtonTheme />}
			</div>
			<form
				onSubmit={onSubmit}
				className={`${styles.LForm__content} ${styles[`LForm__content--${size}`]}`}
			>
				{children}
				<Button
					type="submit"
					className={`${styles.LForm__button} ${styles[`LForm__button--${size}`]}`}
					text="Enviar"
				/>
			</form>
		</section>
	);
};
export default LForm;
