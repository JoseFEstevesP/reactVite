import { Icons } from '../icon/Icons';
import style from './styles.module.scss';
import type { PaginationProps } from './types';

const Pagination = ({
	pages,
	currentPage,
	size = 'md',
	showFirstLast = false,
	maxButtons = 5,
	onPageChange,
	prevIcon = <Icons iconName="arrow" className={style.pagination__icon} />,
	nextIcon = (
		<Icons
			iconName="arrow"
			className={`${style.pagination__icon} ${style['pagination__icon--right']}`}
		/>
	),
	firstIcon = (
		<Icons
			iconName="arrow"
			className={`${style.pagination__icon} ${style['pagination__icon--first']}`}
		/>
	),
	lastIcon = (
		<Icons
			iconName="arrow"
			className={`${style.pagination__icon} ${style['pagination__icon--last']}`}
		/>
	),
}: PaginationProps) => {
	const getPageNumbers = () => {
		const pageNumbers: number[] = [];
		let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
		let endPage = startPage + maxButtons - 1;

		if (endPage > pages) {
			endPage = pages;
			startPage = Math.max(1, endPage - maxButtons + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}
		return pageNumbers;
	};

	const handlePageClick = (pageNumber: number) => {
		if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= pages) {
			onPageChange(pageNumber);
		}
	};

	const isDisabled = (page: number) => page === currentPage;

	return (
		<nav className={style.pagination} aria-label="Pagination">
			{showFirstLast && (
				<button
					title="Primera página"
					type="button"
					className={`${style.pagination__button} ${style[`pagination__button--${size}`]} ${isDisabled(1) ? style['pagination__button--disabled'] : ''}`}
					onClick={() => handlePageClick(1)}
					disabled={isDisabled(1)}
				>
					{firstIcon}
				</button>
			)}
			<button
				title="Página anterior"
				type="button"
				className={`${style.pagination__button} ${style[`pagination__button--${size}`]} ${isDisabled(currentPage - 1) ? style['pagination__button--disabled'] : ''}`}
				onClick={() => handlePageClick(currentPage - 1)}
				disabled={isDisabled(currentPage - 1)}
			>
				{prevIcon}
			</button>

			{getPageNumbers().map(number => (
				<button
					title={`Ir a la página ${number}`}
					type="button"
					key={number}
					className={`${style.pagination__button} ${style[`pagination__button--${size}`]} ${number === currentPage ? style['pagination__button--active'] : ''}`}
					onClick={() => handlePageClick(number)}
				>
					{number}
				</button>
			))}

			<button
				title="Página siguiente"
				type="button"
				className={`${style.pagination__button} ${style[`pagination__button--${size}`]} ${isDisabled(currentPage + 1) ? style['pagination__button--disabled'] : ''}`}
				onClick={() => handlePageClick(currentPage + 1)}
				disabled={isDisabled(currentPage + 1)}
			>
				{nextIcon}
			</button>
			{showFirstLast && (
				<button
					title="Última página"
					type="button"
					className={`${style.pagination__button} ${style[`pagination__button--${size}`]} ${isDisabled(pages) ? style['pagination__button--disabled'] : ''}`}
					onClick={() => handlePageClick(pages)}
					disabled={isDisabled(pages)}
				>
					{lastIcon}
				</button>
			)}
		</nav>
	);
};

export default Pagination;
