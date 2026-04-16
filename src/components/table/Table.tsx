import type { Column } from './types';
import { Icons } from '../icon/Icons';
import Pagination from '../pagination/Pagination';
import style from './styles.module.scss';
import type { TableProps } from './types';

const Table = <T extends object>({
	columns,
	data,
	currentPage,
	totalPages,
	onPageChange,
	onRowClick,
	sortColumn,
	sortDirection,
	onSort,
	loading = false,
	emptyMessage = 'No hay datos disponibles',
	pagination,
}: TableProps<T>) => {
	const renderCell = (column: Column<T>, row: T) => {
		const key = column.key as keyof T;
		if (column.render) {
			return column.render(row[key], row);
		}
		return String(row[key] ?? '');
	};

	const handleSort = (column: Column<T>) => {
		if (column.sortable && onSort) {
			onSort(column.key as keyof T);
		}
	};

	return (
		<div className={style.table}>
			<div className={style.table__wrapper}>
				<table className={style.table__content}>
					<thead className={style.table__head}>
						<tr className={style.table__row}>
							{columns.map(column => (
								<th
									key={String(column.key)}
									className={`
										${style.table__cell}
										${style['table__cell--header']}
										${column.align ? style[`table__cell--align-${column.align}`] : ''}
										${column.sortable ? style['table__cell--sortable'] : ''}
									`}
									onClick={() => handleSort(column)}
								>
									{column.label}
									{column.sortable && sortColumn === column.key && (
										<Icons
											iconName={sortDirection === 'asc' ? 'arrow' : 'arrow'}
											className={style.table__sortIcon}
										/>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className={style.table__body}>
						{data.length === 0 ? (
							<tr>
								<td colSpan={columns.length} className={style.table__empty}>
									{emptyMessage}
								</td>
							</tr>
						) : (
							data.map((row, index) => (
								<tr
									key={index}
									className={`
										${style.table__row}
										${onRowClick ? style['table__row--clickable'] : ''}
									`}
									onClick={() => onRowClick?.(row)}
								>
									{columns.map(column => (
										<td
											key={String(column.key)}
											className={`
												${style.table__cell}
												${column.align ? style[`table__cell--align-${column.align}`] : ''}
											`}
										>
											{renderCell(column, row)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
				{loading && (
					<div className={style.table__loading}>
						<Icons iconName="spinner" className={style.table__spinner} />
					</div>
				)}
			</div>
			{totalPages > 1 && (
				<div className={style.table__pagination}>
					<Pagination
						pages={totalPages}
						currentPage={currentPage}
						onPageChange={onPageChange}
						{...pagination}
					/>
				</div>
			)}
		</div>
	);
};

export default Table;
