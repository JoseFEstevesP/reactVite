import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useRolStore } from '@/stores/rolStore';
import UserPage from './UserPage';

const mockUsersData = {
	success: true,
	data: {
		rows: [
			{
				uid: '1',
				names: 'John',
				surnames: 'Doe',
				email: 'john@example.com',
				phone: '04121234567',
				uidRol: 'rol1',
				rol: { name: 'Admin', permissions: ['SUPER'] },
				status: true,
				activatedAccount: true,
			},
		],
		count: 1,
		currentPage: 1,
		nextPage: null,
		previousPage: null,
		limit: 10,
		pages: 1,
	},
};

vi.mock('@/api/hooks/useGet', () => ({
	useGet: vi.fn(() => ({
		data: mockUsersData,
		isFetching: false,
		isPending: false,
		isLoading: false,
		isError: false,
		refetch: vi.fn(),
	})),
}));

vi.mock('@/api/hooks/useApiMutation', () => ({
	useApiMutation: vi.fn(() => ({
		mutate: vi.fn(),
		isPending: false,
	})),
}));

vi.mock('@/api/url', () => ({
	routes: {
		user: {
			base: '/user',
			one: '/user/one/:uid',
			delete: '/user/delete/:uid',
		},
	},
}));

vi.mock('@/enums/permissions', () => ({
	Permission: {},
	textPermission: {},
}));

vi.mock('@/globalOptions', () => ({
	ModuleStatus: [],
	textModuleStatus: [],
}));

vi.mock('@/hooks/useApiResponse', () => ({
	useApiResponse: () => ({
		handleSuccess: vi.fn(),
		handleError: vi.fn(),
		getFieldError: vi.fn(),
	}),
}));

vi.mock('@/hooks/useToast', () => ({
	useToast: () => ({
		success: vi.fn(),
		error: vi.fn(),
	}),
}));

vi.mock('@/hooks/useValidate', () => ({
	default: () => ({
		handleData: () => true,
	}),
}));

vi.mock('@/components/modal/Modal', () => ({
	default: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
		isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock('@/components/button/Button', () => ({
	Button: ({ children, onClick, variant }: { children?: React.ReactNode; onClick?: () => void; variant?: string }) =>
		<button type="button" onClick={onClick} data-variant={variant}>{children}</button>,
}));

vi.mock('@/components/filter/Filter', () => ({
	default: () => null,
}));

vi.mock('@/components/filter/useFilter/useFilter', () => ({
	default: () => ({
		handleFilterData: vi.fn(),
		handleResetData: vi.fn(),
		filter: {},
		handlePagination: vi.fn(),
	}),
}));

vi.mock('@/components/link/Link', () => ({
	default: ({ children, to }: { children?: React.ReactNode; to: string }) =>
		<a href={to}>{children}</a>,
}));

vi.mock('@/components/restricted/Restricted', () => ({
	default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/search/Search', () => ({
	default: ({ value, onSubmit }: { value: string; onSubmit: (v: string) => void }) =>
		<input
			type="text"
			placeholder="Buscar..."
			value={value}
			onChange={e => onSubmit(e.target.value)}
			data-testid="search-input"
		/>,
}));

vi.mock('@/components/table/Table', () => ({
	default: ({ columns, data }: { columns: { key: string; label: string; render?: (v: unknown, row: unknown) => React.ReactNode }[]; data: unknown[] }) =>
		<table data-testid="table">
			<thead>
				<tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}</tr>
			</thead>
			<tbody>
				{data.map((row, i) => (
					<tr key={i}>
						{columns.map(col => (
							<td key={col.key}>{col.render ? col.render((row as Record<string, unknown>)[col.key], row) : String((row as Record<string, unknown>)[col.key] ?? '')}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>,
}));

function renderWithProviders(ui: React.ReactElement) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>{ui}</MemoryRouter>
		</QueryClientProvider>,
	);
}

describe('UserPage', () => {
	beforeEach(() => {
		useAuthStore.setState({ token: 'test', isInitialized: true });
		useRolStore.setState({ encryptedRol: 'encrypted' });
	});

	it('renders the table with user data', async () => {
		renderWithProviders(<UserPage />);
		await waitFor(() => {
			expect(screen.getByText('John')).toBeInTheDocument();
			expect(screen.getByText('Doe')).toBeInTheDocument();
			expect(screen.getByText('john@example.com')).toBeInTheDocument();
		});
	});

	it('renders search input', () => {
		renderWithProviders(<UserPage />);
		expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
	});
});
