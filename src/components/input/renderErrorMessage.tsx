import styles from './styles.module.scss';

export const renderErrorMessage = (message: string) => {
	const lines = message.split('\n');
	return (
		<span className={styles.input__errorMessage}>
			{lines.map((line, index) => (
				<span key={index}>
					{line}
					{index < lines.length - 1 && <br />}
				</span>
			))}
		</span>
	);
};
