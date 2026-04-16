import type { To } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Icons } from '../icon/Icons';
import styles from './styles.module.scss';
import type { LinkComponentProps } from './types';

const Link = ({
	className = '',
	children,
	icon,
	size = 'md',
	to,
	variant = 'primary',
	...props
}: LinkComponentProps) => {
	const relativeTo: To =
		typeof to === 'string' ? (to.startsWith('/') ? to : `./${to}`) : to;
	const isExternal = props.target === '_blank';

	return (
		<RouterLink
			{...props}
			to={relativeTo}
			className={`${styles.link} ${styles[`link--${variant}`]} ${styles[`link--${size}`]} ${className}`}
			rel={isExternal ? 'noopener noreferrer' : undefined}
		>
			{children && <span className={styles.link__text}>{children}</span>}
			{icon?.iconName && (
				<Icons
					{...icon}
					className={`${styles.link__icon} ${icon.className || ''}`}
				/>
			)}
		</RouterLink>
	);
};

export default Link;
