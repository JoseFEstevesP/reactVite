import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../button/Button';
import { ButtonTheme } from '../buttonTheme/ButtonTheme';
import { Icons } from '../icon/Icons';
import styles from './styles.module.scss';
import type { MenuItem, MenuProps } from './types';

const MenuItemComponent = ({
	item,
	expanded,
}: {
	item: MenuItem;
	expanded: boolean;
	className?: string;
}) => {
	const [show, setShow] = useState(false);
	const hasSub = item.sub && item.sub.length > 0;

	if (hasSub) {
		return (
			<nav className={styles.subMenu}>
				<button
					type="button"
					title={item.text}
					className={`${styles.subMenu__btn} ${expanded ? styles['subMenu__btn--expanded'] : ''}`}
					onClick={() => setShow(!show)}
					aria-expanded={show}
				>
					<Icons iconName={item.icon} className={styles.subMenu__icon} />
					{expanded && (
						<span className={styles.subMenu__text}>{item.text}</span>
					)}
					{expanded && (
						<Icons
							iconName="arrow"
							className={`${styles.subMenu__arrow} ${show ? styles['subMenu__arrow--open'] : ''}`}
						/>
					)}
				</button>
				<ul
					className={`${styles.subMenu__list} ${show ? styles['subMenu__list--open'] : ''}`}
				>
					{item.sub?.map(subItem => (
						<li key={subItem.text} className={styles.subMenu__item}>
							{subItem.to ? (
								<NavLink
									to={subItem.to}
									className={({ isActive }) =>
										`${styles.subMenu__link} ${isActive ? styles.subMenu__linkActive : ''}`
									}
								>
									<Icons
										iconName={subItem.icon}
										className={styles.subMenu__iconSmall}
									/>
									{expanded && subItem.text}
								</NavLink>
							) : (
								<MenuItemComponent item={subItem} expanded={expanded} />
							)}
						</li>
					))}
				</ul>
			</nav>
		);
	}

	if (!item.to) return null;

	return (
		<NavLink
			to={item.to}
			className={({ isActive }) =>
				`${styles.menu__link} ${isActive ? styles.menu__linkActive : ''}`
			}
		>
			<Icons iconName={item.icon} className={styles.menu__icon} />
			{expanded && <span className={styles.menu__text}>{item.text}</span>}
		</NavLink>
	);
};

const Menu = ({
	items,
	orientation = 'vertical',
	expanded: controlledExpanded,
	onToggle,
	onLogout,
	showProfile = false,
	showThemeToggle = false,
	userName,
	onProfileClick,
	className = '',
}: MenuProps) => {
	const [internalExpanded, setInternalExpanded] = useState(true);
	const expanded = controlledExpanded ?? internalExpanded;

	const handleToggle = () => {
		if (onToggle) {
			onToggle();
		} else {
			setInternalExpanded(!expanded);
		}
	};

	return (
		<aside
			className={`
				${styles.menu}
				${styles[`menu--${orientation}`]}
				${expanded ? styles['menu--expanded'] : ''}
				${className}
			`}
		>
			{orientation === 'vertical' && (
				<header className={styles.menu__header}>
					<button
						type="button"
						title="Toggle menu"
						className={styles.menu__toggle}
						onClick={handleToggle}
						aria-label="Toggle menu"
					>
						<div
							className={`${styles.menu__bar} ${expanded ? styles['menu__bar--open'] : ''}`}
						/>
					</button>
				</header>
			)}

			{(showProfile || showThemeToggle || onLogout) && (
				<div
					className={`${styles.menu__actions} ${expanded ? styles['menu__actions--expanded'] : ''}`}
				>
					{showProfile && (
						<button
							type="button"
							className={styles.menu__profile}
							onClick={onProfileClick}
							title={userName || 'Perfil'}
						>
							<Icons iconName="profile" className={styles.menu__profileIcon} />
							{expanded && userName && (
								<span className={styles.menu__profileName}>{userName}</span>
							)}
						</button>
					)}
					{showThemeToggle && <ButtonTheme />}
					{onLogout && (
						<Button
							type="button"
							variant="ghost"
							onClick={onLogout}
							icon={{ iconName: 'exit' }}
							title="Cerrar sesión"
						/>
					)}
				</div>
			)}

			<nav className={styles.menu__nav}>
				<ul className={styles.menu__list}>
					{items.map((item, index) => (
						<li key={index} className={styles.menu__item}>
							<MenuItemComponent item={item} expanded={expanded} />
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default Menu;
