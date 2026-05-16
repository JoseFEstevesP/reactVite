import { useState } from 'react';

import { useDelete } from '@/api/hooks/useDelete';
import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { Button } from '@/components/button/Button';
import Filter from '@/components/filter/Filter';
import useFilter from '@/components/filter/useFilter/useFilter';
import { useModal } from '@/components/modal/hooks/useModal';
import Restricted from '@/components/restricted/Restricted';
import Search from '@/components/search/Search';
import Table from '@/components/table/Table';
import { useToast } from '@/hooks/useToast';
import useValidate from '@/hooks/useValidate';
import { Permission } from '@/page/rol/enum/Permissions';
import type { AxiosError } from 'axios';
import ModalDelete from './components/modalDelete/ModalDelete';
import { OrderAuditProperty, textOrderAudit } from './enum/Order';
import styles from './styles.module.scss';
import type { Audit, AuditsApiResponse } from './types';

const AuditPage = () => {
	const { handleData } = useValidate();
	const { success } = useToast();
	const { handleError: handleApiError } = useApiResponse();
	const { handleFilterData, handleResetData, filter, handlePagination } =
		useFilter({ orderProperty: OrderAuditProperty.names });
	const { mutate: deleteAudit, isPending: isDeleting } = useDelete<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>
	>(routes.audit.delete);
	const [selectedUid, setSelectedUid] = useState<string>('');
	const [auditUserName, setAuditUserName] = useState<string>('');
	const { isOpen, handleClose, handleOpen } = useModal();

	const pageNumber = filter.page || 1;

	const { data, isFetching, isPending, refetch } = useGet<AuditsApiResponse>(
		routes.audit.base,
		{
			config: {
				params: {
					page: String(pageNumber),
					limit: filter.limit,
					orderProperty: filter.orderProperty,
					order: filter.order,
					...(filter.search && { search: filter.search }),
				},
			},
			queryKey: [
				'audits',
				String(pageNumber),
				filter.limit,
				filter.orderProperty,
				filter.order,
				filter.search ?? '',
			],
			enabled: handleData({ per: Permission.auditRead }),
			refetchOnMount: true,
		},
	);

	const auditsData = data?.data;

	const columns = [
		{
			key: 'user',
			label: 'Usuario',
			render: (_value: unknown, row: Audit) =>
				`${row.user.names} ${row.user.surnames}`,
		},
		{
			key: 'ip',
			label: 'IP',
			render: (_value: unknown, row: Audit) => row.dataToken[0] || '',
		},
		{
			key: 'userAgent',
			label: 'Navegador',
			render: (_value: unknown, row: Audit) => row.dataToken[1] || '',
		},
		{
			key: 'userPlatform',
			label: 'Plataforma',
			render: (_value: unknown, row: Audit) => row.dataToken[2] || '',
		},
		{
			key: 'createdAt',
			label: 'Fecha',
			render: (value: unknown) =>
				value ? new Date(value as string).toLocaleString() : '',
		},
		{
			key: 'actions',
			label: 'Acciones',
			render: (_value: unknown, row: Audit) => (
				<Restricted per={Permission.auditDelete}>
					<Button
						size="sm"
						icon={{
							iconName: 'delete',
						}}
						variant="ghost"
						onClick={() => {
							setSelectedUid(row.uid);
							setAuditUserName(`${row.user.names} ${row.user.surnames}`);
							handleOpen();
						}}
					/>
				</Restricted>
			),
		},
	];

	const searchValue = filter.search || '';

	return (
		<>
			<Restricted per={Permission.auditDelete}>
				<ModalDelete
					isOpen={isOpen}
					handleClose={handleClose}
					userName={auditUserName}
					selectedUid={selectedUid}
					isDeleting={isDeleting}
					handleDelete={() => {
						deleteAudit(selectedUid, {
							onSuccess: () => {
								success('Registro de auditoría eliminado correctamente');
								refetch();
								handleClose();
							},
							onError: err => {
								handleApiError(err);
								handleClose();
							},
						});
					}}
				/>
			</Restricted>
			<section className={styles.auditPage}>
				<Restricted per={Permission.auditRead}>
					<section className={styles.auditPage__actions}>
						<Search
							value={searchValue}
							onSubmit={(value: string) => handleFilterData({ search: value })}
							className={styles.auditPage__search}
						/>
						<Filter
							onFilter={handleFilterData}
							onReset={handleResetData}
							orderConfig={{
								OrderProperty: OrderAuditProperty,
								textOrderProperty: textOrderAudit,
								defaultOrderProperty: OrderAuditProperty.names,
							}}
							className={styles.auditPage__filter}
						/>
					</section>
				</Restricted>
				<Restricted per={Permission.auditRead}>
					<Table
						columns={columns}
						data={auditsData?.rows || []}
						onPageChange={handlePagination}
						currentPage={auditsData?.currentPage || 1}
						totalPages={auditsData?.pages || 1}
						loading={isFetching || isPending}
					/>
				</Restricted>
			</section>
		</>
	);
};
export default AuditPage;
