import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ToastContainer } from './components/toast/ToastContainer';
import { QueryProvider } from './providers/QueryProvider';
import { useAuthStore } from './stores/authStore';
import './styles/reset.scss';
import './styles/style.scss';

const InitializeAuth = ({ children }: { children: React.ReactNode }) => {
	const { initialize } = useAuthStore();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return children;
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryProvider>
				<InitializeAuth>
					<App />
					<ToastContainer />
				</InitializeAuth>
			</QueryProvider>
		</BrowserRouter>
	</StrictMode>,
);
