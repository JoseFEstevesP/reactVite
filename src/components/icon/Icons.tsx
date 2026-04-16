import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import type { IconParameter } from './types';

const spriteCache = new Map<string, string>();

const iconPack = {
	icon: import('/assets/icons/defaultIcons-pack.svg'),
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

		loadSprite('icon')
			.then(url => {
				setSpriteUrl(url);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	}, []);

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
			<div
				className={`${styles.fallback} ${className || ''}`}
				style={inlineStyle}
				role="img"
				aria-label={`Icon ${iconName}`}
			>
				{iconName.charAt(0).toUpperCase()}
			</div>
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
