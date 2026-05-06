import styles from './styles.module.scss';

const Loader = () => {
	return (
		<div className={styles.loader}>
			<svg
				className={styles.loader__svg}
				viewBox="0 0 500 500"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					className={styles.loader__ray}
					d="M250 125V62.5"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M338.542 161.458L383.333 116.667"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M375 250H437.5"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M338.542 338.542L383.333 383.333"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M250 375V437.5"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M161.458 338.542L116.667 383.333"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M125 250H62.5"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					className={styles.loader__ray}
					d="M161.458 161.458L116.667 116.667"
					stroke="currentColor"
					strokeWidth="30"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};
export default Loader;
