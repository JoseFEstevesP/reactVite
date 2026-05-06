import { useState } from 'react';

import { useDelete } from '@/api/hooks/useDelete';
import { useGet } from '@/api/hooks/useGet';
import { routes } from '@/api/url';
import type { ApiResponse, ApiErrorResponse } from '@/globalTypes';
import { useApiResponse } from '@/hooks/useApiResponse';
import { Button } from '@/components/button/Button';
import Filter from '@/components/filter/Filter';
import useFilter from '@/components/filter/useFilter/useFilter';
import Link from '@/components/link/Link';
import { useModal } from '@/components/modal/hooks/useModal';
import Search from '@/components/search/Search';
import Table from '@/components/table/Table';
import { useToast } from '@/hooks/useToast';
import type { AxiosError } from 'axios';
import ModalDelete from './components/modalDelete/ModalDelete';
import { OrderRolProperty, textOrderRol } from './enum/Order';
import { Permission, textPermission } from './enum/Permissions';
import styles from './styles.module.scss';
import type { Role, RolesApiResponse } from './types';

const RolStatus = {
	all: '',
	active: 'true',
	inactive: 'false',
};

const textRolStatus: Record<string, string> = {
	[RolStatus.active]: 'Activo',
	[RolStatus.inactive]: 'Inactivo',
};

const RolPage = () => {
	const { success } = useToast();
	const { handleError: handleApiError } = useApiResponse();
	const { handleFilterData, handleResetData, filter, handlePagination } =
		useFilter({ orderProperty: OrderRolProperty.name });
	const { mutate: deleteRole, isPending: isDeleting } = useDelete<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>
	>(routes.rol.delete);
	const [selectedUid, setSelectedUid] = useState<string>('');
	const [rolName, setRolName] = useState<string>('');
	const { isOpen, handleClose, handleOpen } = useModal();

	const pageNumber = filter.page || 1;

	const { data, isFetching, isPending, refetch } = useGet<RolesApiResponse>(
		routes.rol.base,
		{
			config: {
				params: {
					page: String(pageNumber),
					limit: filter.limit,
					orderProperty: filter.orderProperty,
					order: filter.order,
					...(filter.search && { search: filter.search }),
					...(filter.permission && { permission: filter.permission }),
					...(filter.status &&
						filter.status !== '' && { status: filter.status }),
				},
			},
			queryKey: [
				'roles',
				String(pageNumber),
				filter.limit,
				filter.orderProperty,
				filter.order,
				filter.search,
				filter.permission ?? '',
				filter.status ?? '',
			],
			enabled: true,
			refetchOnMount: true,
		},
	);

	const rolesData = data?.data;

	const columns = [
		{ key: 'name', label: 'Nombre' },
		{ key: 'description', label: 'Descripción' },
		{
			key: 'permissions',
			label: 'Permisos',
			render: (_value: unknown, row: Role) =>
				row.permissions.map(perm => textPermission[perm] || perm).join(', '),
		},
		{
			key: 'status',
			label: 'Estado',
			render: (value: unknown) => (value ? 'Activo' : 'Inactivo'),
		},
		{
			key: 'actions',
			label: 'Acciones',
			render: (_value: unknown, row: Role) => (
				<>
					<Link
						to={`/rol/update/${row.uid}`}
						size="sm"
						icon={{
							iconName: 'edit',
						}}
						variant="ghost"
					/>
					<Button
						size="sm"
						icon={{
							iconName: 'delete',
						}}
						variant="ghost"
						onClick={() => {
							setSelectedUid(row.uid);
							setRolName(row.name);
							handleOpen();
						}}
					/>
				</>
			),
		},
	];

	const searchValue = filter.search || '';

	return (
		<>
			<ModalDelete
				isOpen={isOpen}
				handleClose={handleClose}
				rolName={rolName}
				selectedUid={selectedUid}
				isDeleting={isDeleting}
				handleDelete={() => {
					deleteRole(selectedUid, {
						onSuccess: () => {
							success('Rol eliminado correctamente');
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
			<section className={styles.rolPage}>
				<Search
					value={searchValue}
					onSubmit={(value: string) => handleFilterData({ search: value })}
					className={styles.rolPage__search}
				/>
				<section className={styles.rolPage__actions}>
					<Link
						to="/rol/register"
						size="sm"
						icon={{
							iconName: 'add',
						}}
						variant="secondary"
					>
						Registrar
					</Link>
					<Filter
						onFilter={handleFilterData}
						onReset={handleResetData}
						orderConfig={{
							OrderProperty: OrderRolProperty,
							textOrderProperty: textOrderRol,
							defaultOrderProperty: OrderRolProperty.name,
						}}
						customSelects={[
							{
								name: 'permission',
								label: 'Permiso',
								options: Permission,
								textOptions: textPermission,
								withAllOption: true,
								allOptionLabel: 'Todo',
							},
							{
								name: 'status',
								label: 'Estado',
								options: RolStatus,
								textOptions: textRolStatus,
								withAllOption: true,
								allOptionLabel: 'Todo',
							},
						]}
						className={styles.rolPage__filter}
					/>
				</section>
				<Table
					columns={columns}
					data={rolesData?.rows || []}
					onPageChange={handlePagination}
					currentPage={rolesData?.currentPage || 1}
					totalPages={rolesData?.pages || 1}
					loading={isFetching || isPending}
				/>
			</section>
		</>
	);
};
export default RolPage;
