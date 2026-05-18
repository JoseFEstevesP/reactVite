import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import type { IconParameter } from './types';

const spriteCache = new Map<string, string>();

const iconPack = {
	default: import('/assets/icons/defaultIcons-pack.svg'),
	reactVite: import('/assets/icons/reactVite-pack.svg'),
};

async function loadSprite(type: string): Promise<string> {
	const cached = spriteCache.get(type);
	if (cached) return Promise.resolve(cached);

	const res = await (iconPack[type as keyof typeof iconPack] as Promise<{
		default: string;
	}>);
	spriteCache.set(type, res.default);
	return res.default;
}

export const Icons = ({
	iconName,
	pack = 'default',
	size,
	fallback,
	className,
	...props
}: IconParameter) => {
	const [spriteUrl, setSpriteUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		setLoading(true);
		setError(false);

		loadSprite(pack)
			.then(url => {
				setSpriteUrl(url);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	}, [pack]);

	const href = useMemo(() => {
		if (!spriteUrl || !iconName) return '';
		return `${spriteUrl}#${iconName}`;
	}, [spriteUrl, iconName]);

	const inlineStyle = useMemo(() => {
		if (!size) return undefined;
		const sizeValue = typeof size === 'number' ? `${size}px` : size;
		return { width: sizeValue, height: sizeValue };
	}, [size]);

	if (error && fallback) {
		return <>{fallback}</>;
	}

	if (error && !fallback) {
		return (
			<svg
				{...props}
				className={`${styles.fallback} ${className || ''}`}
				style={inlineStyle}
				viewBox="0 0 24 24"
				role="img"
				aria-label={`Icon ${iconName} not found`}
			>
				<path
					fill="currentColor"
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
		);
	}

	return (
		<svg
			{...props}
			role="img"
			className={`${styles.icon} ${className || ''}`}
			aria-hidden="true"
			style={{ ...inlineStyle, ...props.style }}
		>
			{loading ? null : <use href={href} />}
		</svg>
	);
};

Icons.styles = styles;
