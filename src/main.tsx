import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { QueryProvider } from './providers/QueryProvider';
import './styles/reset.scss';
import './styles/style.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryProvider>
				<Toaster position="top-right" />
				<App />
			</QueryProvider>
		</BrowserRouter>
	</StrictMode>,
);
