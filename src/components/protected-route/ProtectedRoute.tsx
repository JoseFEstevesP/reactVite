import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const ProtectedRoute = () => {
	const { token, isInitialized } = useAuthStore();

	if (!isInitialized) {
		return null;
	}

	return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
