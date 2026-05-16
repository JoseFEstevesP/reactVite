import { Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import Restricted from './components/restricted/Restricted';
import LDashboard from './layout/dashboard/LDashboard';
import { Permission } from './page/rol/enum/Permissions';
import AuditPage from './page/audit/AuditPage';
import Dashboard from './page/dashboard/Dashboard';
import ProfilePage from './page/profile/ProfilePage';
import RolPage from './page/rol/RolPage';
import Register from './page/rol/components/register/Register';
import Update from './page/rol/components/update/Update';
import UserPage from './page/user/UserPage';
import UserRegister from './page/user/components/register/Register';
import UserUpdate from './page/user/components/update/Update';
import { menuItem } from './const/menuItem';

const App = () => {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<ProtectedRoute />}>
				<Route element={<LDashboard menuItem={menuItem} />}>
					<Route
						path="/"
						element={
							<Restricted per={Permission.dashboard}>
								<Dashboard />
							</Restricted>
						}
					/>
					<Route path="/rol">
						<Route
							index
							element={
								<Restricted per={Permission.rol}>
									<RolPage />
								</Restricted>
							}
						/>
						<Route
							path="register"
							element={
								<Restricted per={Permission.rolAdd}>
									<Register />
								</Restricted>
							}
						/>
						<Route
							path="update/:uid"
							element={
								<Restricted per={Permission.rolUpdate}>
									<Update />
								</Restricted>
							}
						/>
					</Route>
					<Route path="/users">
						<Route
							index
							element={
								<Restricted per={Permission.user}>
									<UserPage />
								</Restricted>
							}
						/>
						<Route
							path="register"
							element={
								<Restricted per={Permission.userAdd}>
									<UserRegister />
								</Restricted>
							}
						/>
						<Route
							path="update/:uid"
							element={
								<Restricted per={Permission.userUpdate}>
									<UserUpdate />
								</Restricted>
							}
						/>
					</Route>
					<Route path="/audits">
						<Route
							index
							element={
								<Restricted per={Permission.audit}>
									<AuditPage />
								</Restricted>
							}
						/>
					</Route>
					<Route
						path="/profile"
						element={
							<Restricted per={Permission.userProfile}>
								<ProfilePage />
							</Restricted>
						}
					/>
				</Route>
			</Route>
		</Routes>
	);
};
export default App;
