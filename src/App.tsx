import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import LDashboard from './layout/dashboard/LDashboard';
import AuditPage from './page/audit/AuditPage';
import Dashboard from './page/dashboard/Dashboard';
import RolPage from './page/rol/RolPage';
import Register from './page/rol/components/register/Register';
import Update from './page/rol/components/update/Update';
import UserPage from './page/user/UserPage';
import UserRegister from './page/user/components/register/Register';
import UserUpdate from './page/user/components/update/Update';

const App = () => {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<ProtectedRoute />}>
				<Route
					element={
						<LDashboard
							menuItem={[
								{ icon: 'home', text: 'Dashboard', to: '/' },
								{ icon: 'rol', text: 'Rol', to: '/rol' },
								{ icon: 'user', text: 'Users', to: '/users' },
								{ icon: 'audit', text: 'Auditoría', to: '/audits' },
							]}
						/>
					}
				>
					<Route path="/" element={<Dashboard />} />
					<Route path="/rol">
						<Route index element={<RolPage />} />
						<Route path="register" element={<Register />} />
						<Route path="update/:uid" element={<Update />} />
					</Route>
					<Route path="/users">
						<Route index element={<UserPage />} />
						<Route path="register" element={<UserRegister />} />
						<Route path="update/:uid" element={<UserUpdate />} />
					</Route>
					<Route path="/audits">
						<Route index element={<AuditPage />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
};
export default App;
