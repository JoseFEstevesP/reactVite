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
import { OrderUserProperty, textOrderUser } from './enum/Order';
import styles from './styles.module.scss';
import type { User, UsersApiResponse } from './types';

const UserStatus = {
	all: '',
	active: 'true',
	inactive: 'false',
};

const textUserStatus: Record<string, string> = {
	[UserStatus.active]: 'Activo',
	[UserStatus.inactive]: 'Inactivo',
};

const UserPage = () => {
	const { success } = useToast();
	const { handleError: handleApiError } = useApiResponse();
	const { handleFilterData, handleResetData, filter, handlePagination } =
		useFilter({ orderProperty: OrderUserProperty.email });
	const { mutate: deleteUser, isPending: isDeleting } = useDelete<
		ApiResponse<{ msg: string }>,
		AxiosError<ApiErrorResponse>
	>(routes.user.delete);
	const [selectedUid, setSelectedUid] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const { isOpen, handleClose, handleOpen } = useModal();

	const pageNumber = filter.page || 1;

	const { data, isFetching, isPending, refetch } = useGet<UsersApiResponse>(
		routes.user.base,
		{
			config: {
				params: {
					page: String(pageNumber),
					limit: filter.limit,
					orderProperty: filter.orderProperty,
					order: filter.order,
					...(filter.search && { search: filter.search }),
					...(filter.status &&
						filter.status !== '' && { status: filter.status }),
				},
			},
			queryKey: [
				'users',
				String(pageNumber),
				filter.limit,
				filter.orderProperty,
				filter.order,
				filter.search,
				filter.status ?? '',
			],
			enabled: true,
			refetchOnMount: true,
		},
	);

	const usersData = data?.data;

	const columns = [
		{ key: 'names', label: 'Nombres' },
		{ key: 'surnames', label: 'Apellidos' },
		{ key: 'email', label: 'Correo' },
		{ key: 'phone', label: 'Teléfono' },
		{
			key: 'rol',
			label: 'Rol',
			render: (_value: unknown, row: User) => row.rol.name,
		},
		{
			key: 'status',
			label: 'Estado',
			render: (value: unknown) => (value ? 'Activo' : 'Inactivo'),
		},
		{
			key: 'activatedAccount',
			label: 'Cuenta activada',
			render: (value: unknown) => (value ? 'Sí' : 'No'),
		},
		{
			key: 'actions',
			label: 'Acciones',
			render: (_value: unknown, row: User) => (
				<>
					<Link
						to={`/users/update/${row.uid}`}
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
							setUserName(`${row.names} ${row.surnames}`);
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
				userName={userName}
				selectedUid={selectedUid}
				isDeleting={isDeleting}
				handleDelete={() => {
					deleteUser(selectedUid, {
						onSuccess: () => {
							success('Usuario eliminado correctamente');
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
			<section className={styles.userPage}>
				<Search
					value={searchValue}
					onSubmit={(value: string) => handleFilterData({ search: value })}
					className={styles.userPage__search}
				/>
				<section className={styles.userPage__actions}>
					<Link
						to="/users/register"
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
							OrderProperty: OrderUserProperty,
							textOrderProperty: textOrderUser,
							defaultOrderProperty: OrderUserProperty.email,
						}}
						customSelects={[
							{
								name: 'status',
								label: 'Estado',
								options: UserStatus,
								textOptions: textUserStatus,
								withAllOption: true,
								allOptionLabel: 'Todo',
							},
						]}
						className={styles.userPage__filter}
					/>
				</section>
				<Table
					columns={columns}
					data={usersData?.rows || []}
					onPageChange={handlePagination}
					currentPage={usersData?.currentPage || 1}
					totalPages={usersData?.pages || 1}
					loading={isFetching || isPending}
				/>
			</section>
		</>
	);
};
export default UserPage;
