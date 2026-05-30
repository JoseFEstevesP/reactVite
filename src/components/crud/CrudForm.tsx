import type { ReactNode } from 'react';
import type {
	Control,
	FieldErrors,
	FieldValues,
	UseFormRegister,
} from 'react-hook-form';
import Form from '@/components/form/Form';
import type { FormField } from '@/components/form/Form';
import styles from '@/styles/form.module.scss';

interface CrudFormProps<T extends FieldValues> {
	title: string;
	onSubmit: () => void;
	register?: UseFormRegister<T>;
	errors?: FieldErrors<T>;
	control?: Control<T>;
	renderOptions: FormField[];
	size?: 'sm' | 'md';
	children?: ReactNode;
}

const CrudForm = <T extends FieldValues>({
	title,
	onSubmit,
	register,
	errors,
	control,
	renderOptions,
	size,
	children,
}: CrudFormProps<T>) => {
	return (
		<section className={styles.crud}>
			<Form
				title={title}
				onSubmit={onSubmit}
				register={register}
				errors={errors}
				control={control}
				renderOptions={renderOptions}
				size={size}
			/>
			{children}
		</section>
	);
};

export default CrudForm;
